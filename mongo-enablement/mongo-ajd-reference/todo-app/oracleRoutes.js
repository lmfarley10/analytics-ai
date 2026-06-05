const express = require('express');
const { getOracleConfig, getOracleConnection } = require('./oracleDb');

const router = express.Router();

function parseJsonDocument(value) {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return JSON.parse(value);
  }

  if (Buffer.isBuffer(value)) {
    return JSON.parse(value.toString('utf8'));
  }

  return value;
}

function isValidIsoTimestamp(value) {
  if (!value) {
    return false;
  }

  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}T/.test(value);
}

function quotedCollectionTable() {
  const { collectionTable } = getOracleConfig();

  if (!/^[A-Za-z][A-Za-z0-9_$#]*$/.test(collectionTable)) {
    throw new Error(`Invalid ORACLE_COLLECTION_TABLE value: ${collectionTable}`);
  }

  return `"${collectionTable}"`;
}

async function withOracleConnection(handler, res, fallbackMessage) {
  let connection;

  try {
    connection = await getOracleConnection();
    return await handler(connection);
  } catch (error) {
    return res.status(503).json({
      error: fallbackMessage,
      details: error.message,
      hint: 'Confirm the target AJD SQL wallet, credentials, and required SQL objects are configured.',
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

async function hasTodoVpdPolicy(connection) {
  const result = await connection.execute(
    `SELECT COUNT(*) AS policy_count
     FROM user_policies
     WHERE object_name = UPPER(:object_name)
       AND policy_name = 'TODO_OWNER_VPD_POLICY'`,
    { object_name: getOracleConfig().collectionTable }
  );

  return result.rows[0].POLICY_COUNT > 0;
}

router.get('/dashboard', async (req, res) => {
  const config = getOracleConfig();

  await withOracleConnection(async (connection) => {
    const result = await connection.execute(
      `SELECT get_todo_dashboard_json() AS dashboard_json FROM dual`
    );

    const dashboard = parseJsonDocument(result.rows[0].DASHBOARD_JSON);
    res.json({
      source: 'oracle-plsql',
      collection: config.collectionTable,
      dashboard,
    });
  }, res, 'Oracle dashboard unavailable');
});

router.get('/secure-tasks', async (req, res) => {
  const userId = req.get('x-user-id');

  if (!userId) {
    return res.status(400).json({
      error: 'Missing x-user-id header',
      hint: 'Send x-user-id to set the Oracle session context for secure filtering.',
    });
  }

  await withOracleConnection(async (connection) => {
    const tableName = quotedCollectionTable();
    await connection.execute(`BEGIN todo_security_pkg.set_user_id(:user_id); END;`, { user_id: userId });
    const useVpdPolicy = await hasTodoVpdPolicy(connection);

    const result = await connection.execute(
      `SELECT json_serialize(data RETURNING CLOB) AS document
       FROM ${tableName}
       WHERE LOWER(TRIM(json_value(data, '$.ownerId'))) = LOWER(TRIM(sys_context('USERENV', 'CLIENT_IDENTIFIER')))
       ORDER BY json_value(data, '$.createdAt') DESC`
    );

    res.json({
      source: useVpdPolicy ? 'oracle-vpd-plus-session-filter' : 'oracle-session-context',
      userId,
      policy: useVpdPolicy ? 'TODO_OWNER_VPD_POLICY + CLIENT_IDENTIFIER_FILTER' : 'CLIENT_IDENTIFIER_FILTER',
      tasks: result.rows.map((row) => parseJsonDocument(row.DOCUMENT)),
    });
  }, res, 'Oracle secure tasks demo unavailable');
});

router.get('/as-of', async (req, res) => {
  const { ts } = req.query;

  if (!isValidIsoTimestamp(ts)) {
    return res.status(400).json({
      error: 'Invalid timestamp',
      hint: 'Use an ISO timestamp such as 2026-05-22T20:20:00Z.',
    });
  }

  await withOracleConnection(async (connection) => {
    const tableName = quotedCollectionTable();
    const result = await connection.execute(
      `SELECT json_serialize(data RETURNING CLOB) AS document
       FROM ${tableName} AS OF TIMESTAMP TO_TIMESTAMP(:ts, 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"')
       ORDER BY json_value(data, '$.createdAt') DESC`,
      { ts: new Date(ts).toISOString() }
    );

    res.json({
      source: 'oracle-flashback',
      collection: getOracleConfig().collectionTable,
      asOf: new Date(ts).toISOString(),
      tasks: result.rows.map((row) => parseJsonDocument(row.DOCUMENT)),
    });
  }, res, 'Flashback query failed');
});

module.exports = router;
