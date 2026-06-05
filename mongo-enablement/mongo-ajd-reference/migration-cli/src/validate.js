const { connectSource, connectTarget, loadConfig } = require('./connect');
const { discoverDatabase } = require('./discover');

function calculateTransferPercent(sourceCount, targetCount) {
  if (sourceCount === 0 && targetCount === 0) {
    return 100;
  }

  if (sourceCount === 0) {
    return 0;
  }

  return Math.round((targetCount / sourceCount) * 10000) / 100;
}

function buildValidationRows({ sourceDiscovery, targetCounts }) {
  return sourceDiscovery.map((collection) => {
    const sourceCount = collection.count;
    const targetCount = targetCounts[collection.name] ?? 0;
    const transferPercent = calculateTransferPercent(sourceCount, targetCount);

    return {
      collection: collection.name,
      sourceCount,
      targetCount,
      transferPercent,
      status: sourceCount === targetCount ? 'PASS' : 'REVIEW',
    };
  });
}

function printValidationTable(rows, logger = console) {
  const headers = ['Collection', 'Source Count', 'Target Count', 'Transfer %', 'Status'];
  const tableRows = rows.map((row) => [
    row.collection,
    String(row.sourceCount),
    String(row.targetCount),
    `${row.transferPercent.toFixed(2)}%`,
    row.status,
  ]);
  const widths = headers.map((header, index) => Math.max(
    header.length,
    ...tableRows.map((row) => row[index].length)
  ));

  function formatRow(values) {
    return `| ${values.map((value, index) => value.padEnd(widths[index])).join(' | ')} |`;
  }

  const separator = `|-${widths.map((width) => '-'.repeat(width)).join('-|-')}-|`;

  logger.log(formatRow(headers));
  logger.log(separator);
  for (const row of tableRows) {
    logger.log(formatRow(row));
  }
}

async function collectTargetCounts({ targetDb, sourceDiscovery, logger = console }) {
  const targetCounts = {};

  for (const collection of sourceDiscovery) {
    logger.log(`-> Counting target collection: ${collection.name}`);
    targetCounts[collection.name] = await targetDb.collection(collection.name).countDocuments();
  }

  return targetCounts;
}

async function validateMigration(options = {}) {
  const logger = options.logger || console;
  const config = options.config || loadConfig(options.envPath);
  let sourceClient;
  let targetClient;

  logger.log('== STEP 1: PREPARING MIGRATION VALIDATION ==');
  logger.log('-> Why: Validation proves the migrated AJD target has the same collection counts as the source.');

  try {
    logger.log('\n== STEP 2: CONNECTING TO SOURCE AND TARGET ==');
    sourceClient = await connectSource(config, logger);
    targetClient = await connectTarget(config, logger);

    const sourceDb = sourceClient.db();
    const targetDb = targetClient.db();

    logger.log('\n== STEP 3: DISCOVERING SOURCE COLLECTIONS FOR VALIDATION ==');
    const sourceDiscovery = await discoverDatabase(sourceDb, logger);

    logger.log('\n== STEP 4: COUNTING TARGET COLLECTIONS ==');
    logger.log('-> Why: Target counts verify whether every source document arrived in AJD.');
    const targetCounts = await collectTargetCounts({ targetDb, sourceDiscovery, logger });

    const rows = buildValidationRows({ sourceDiscovery, targetCounts });
    const allPassed = rows.every((row) => row.status === 'PASS');

    logger.log('\n== STEP 5: VALIDATION SUMMARY TABLE ==');
    printValidationTable(rows, logger);

    if (allPassed) {
      logger.log('\n== VALIDATION RESULT: SUCCESS ==');
      logger.log('-> Result: 100% data transfer confirmed by collection document counts.');
    } else {
      logger.log('\n== VALIDATION RESULT: REVIEW REQUIRED ==');
      logger.log('-> Result: One or more target counts differ from source counts. Review the summary table before cutover.');
    }

    logger.log('\n== DEMO CONFIGURATION HELPER ==');
    logger.log('-> Why: After validation, the original application can point at AJD by changing only its MongoDB connection string.');
    logger.log(`SUCCESS! Switch your application to this Target Connection String: ${config.targetUri}`);

    return { rows, allPassed };
  } finally {
    if (sourceClient) {
      await sourceClient.close();
      logger.log('\n== CLEANUP: SOURCE CONNECTION CLOSED ==');
    }

    if (targetClient) {
      await targetClient.close();
      logger.log('== CLEANUP: TARGET CONNECTION CLOSED ==');
    }
  }
}

module.exports = {
  buildValidationRows,
  calculateTransferPercent,
  collectTargetCounts,
  printValidationTable,
  validateMigration,
};