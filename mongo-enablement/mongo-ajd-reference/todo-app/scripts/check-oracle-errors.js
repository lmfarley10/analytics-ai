const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { getOracleConnection } = require('../oracleDb');

async function main() {
  let connection;
  try {
    connection = await getOracleConnection();
    const result = await connection.execute(
      `SELECT name, type, line, position, text
       FROM user_errors
       WHERE name IN ('GET_TODO_DASHBOARD_JSON', 'TODO_DASHBOARD_PKG', 'TODO_SECURITY_PKG')
       ORDER BY name, sequence`
    );

    if (!result.rows.length) {
      console.log('No compile errors found for checked objects.');
      return;
    }

    for (const row of result.rows) {
      console.log(`${row.NAME} ${row.TYPE} line ${row.LINE}, position ${row.POSITION}: ${row.TEXT}`);
    }
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});