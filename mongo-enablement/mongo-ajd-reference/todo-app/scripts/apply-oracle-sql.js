const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { getOracleConnection } = require('../oracleDb');

const scriptFiles = [
  '01_dashboard_package.sql',
  '02_vpd_context_policy.sql',
  '03_flashback_grants_check.sql',
];

function splitSqlclScript(scriptText) {
  return scriptText
    .split(/^\s*\/\s*$/m)
    .map((statement) => statement.trim())
    .filter(Boolean)
    .map((statement) => {
      // node-oracledb rejects trailing semicolons for plain SQL statements,
      // but PL/SQL blocks and CREATE FUNCTION/PACKAGE statements need their
      // internal semicolons preserved exactly as authored.
      if (/^(select|with)\b/i.test(statement)) {
        return statement.replace(/;\s*$/, '');
      }

      return statement;
    });
}

async function main() {
  let connection;

  try {
    connection = await getOracleConnection();

    for (const fileName of scriptFiles) {
      const filePath = path.resolve(__dirname, '../sql', fileName);
      const scriptText = fs.readFileSync(filePath, 'utf8');
      const statements = splitSqlclScript(scriptText);

      console.log(`== APPLYING ${fileName} ==`);

      for (const statement of statements) {
        const preview = statement.split('\n')[0].slice(0, 90);
        console.log(`-> Executing: ${preview}${statement.length > preview.length ? '...' : ''}`);

        try {
          await connection.execute(statement);
        } catch (error) {
          if (fileName.startsWith('02_')) {
            console.warn('-> Warning: VPD policy attachment could not be completed in this environment.');
            console.warn(`-> Reason: ${error.message}`);
            console.warn('-> Continuing: The app will use the CLIENT_IDENTIFIER secure-task filter.');
            break;
          }

          if (fileName.startsWith('03_')) {
            console.warn('-> Warning: Flashback readiness check failed.');
            console.warn(`-> Reason: ${error.message}`);
            console.warn('-> Continuing: The endpoint will return helpful errors for unsupported timestamps.');
            break;
          }

          throw error;
        }
      }
    }

    console.log('== ORACLE SQL SETUP COMPLETE ==');
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

main().catch((error) => {
  console.error('== ORACLE SQL SETUP FAILED ==');
  console.error(error.message);
  process.exitCode = 1;
});
