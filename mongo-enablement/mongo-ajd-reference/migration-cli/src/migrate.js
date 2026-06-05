const { connectSource, connectTarget, loadConfig } = require('./connect');
const { discoverDatabase } = require('./discover');
const { replicateIndexes } = require('./indexes');

const DEFAULT_BATCH_SIZE = 100;

async function migrateCollection({
  sourceDb,
  targetDb,
  collectionName,
  batchSize = DEFAULT_BATCH_SIZE,
  mode = 'insert',
  logger = console,
}) {
  if (!collectionName) {
    throw new Error('A collection name is required for migration.');
  }

  if (!['insert', 'upsert', 'replace'].includes(mode)) {
    throw new Error('Migration mode must be "insert", "upsert", or "replace".');
  }

  const sourceCollection = sourceDb.collection(collectionName);
  const targetCollection = targetDb.collection(collectionName);
  const logError = logger.error ? logger.error.bind(logger) : logger.log.bind(logger);

  logger.log(`== MIGRATING COLLECTION: ${collectionName} ==`);
  logger.log('-> Why: Sprint 2 validates the core migration loop on one collection before scaling out.');
  logger.log(`-> Batch size: ${batchSize}`);
  logger.log(`-> Migration mode: ${mode}`);
  logger.log('-> Why: Batching ensures memory efficiency and keeps large collections from loading all at once.');

  const totalDocuments = await sourceCollection.countDocuments();
  const totalBatches = Math.ceil(totalDocuments / batchSize);

  logger.log(`-> Source document count: ${totalDocuments}`);
  logger.log(`-> Planned batches: ${totalBatches}`);

  if (totalDocuments === 0) {
    let deletedDocuments = 0;

    if (mode === 'replace') {
      logger.log('-> Replace mode cleanup: source is empty, clearing target collection.');
      const deleteResult = await targetCollection.deleteMany({});
      deletedDocuments = deleteResult.deletedCount || 0;
      logger.log(`-> Replace mode cleanup removed ${deletedDocuments} target document(s).`);
    }

    logger.log('-> Result: Collection is empty. Nothing to migrate.');
    return {
      collectionName,
      totalDocuments,
      migratedDocuments: 0,
      batchesWritten: 0,
      deletedDocuments,
    };
  }

  const cursor = sourceCollection.find({}).batchSize(batchSize);
  let batch = [];
  let migratedDocuments = 0;
  let batchesWritten = 0;
  const sourceIds = [];

  async function writeBatch(documents) {
    if (!documents.length) {
      return;
    }

    batchesWritten += 1;
    logger.log(`-> Writing batch ${batchesWritten}/${totalBatches} (${documents.length} document(s))...`);
    logger.log(mode === 'upsert'
      ? '-> Why: upsert mode safely copies new and changed documents without failing on existing _id values.'
      : '-> Why: insertMany preserves MongoDB-style JSON documents while reducing network round trips.');

    try {
      if (mode === 'upsert' || mode === 'replace') {
        await targetCollection.bulkWrite(
          documents.map((document) => ({
            replaceOne: {
              filter: { _id: document._id },
              replacement: document,
              upsert: true,
            },
          })),
          { ordered: false }
        );
      } else {
        await targetCollection.insertMany(documents, { ordered: false });
      }
      migratedDocuments += documents.length;
    } catch (error) {
      logError(`-> ERROR: Batch ${batchesWritten}/${totalBatches} failed for collection ${collectionName}.`);
      logError(`-> Error message: ${error.message}`);
      logError('-> Why this matters: A failed batch means some documents may not have been copied and validation must catch the mismatch.');
      logError('-> Graceful handling: Stopping this migration now so the operator can fix the cause before continuing.');
      error.collectionName = collectionName;
      error.batchNumber = batchesWritten;
      error.batchSize = documents.length;
      throw error;
    }

    logger.log(`-> Wrote batch ${batchesWritten}/${totalBatches}. Migrated ${migratedDocuments}/${totalDocuments} document(s).`);
  }

  for await (const document of cursor) {
    batch.push(document);
    sourceIds.push(document._id);

    if (batch.length === batchSize) {
      await writeBatch(batch);
      batch = [];
    }
  }

  await writeBatch(batch);

  let deletedDocuments = 0;

  if (mode === 'replace') {
    logger.log('-> Replace mode cleanup: deleting target documents that are no longer present in source.');
    const sourceIdSet = new Set(sourceIds.map((id) => String(id)));
    const targetIdCursor = targetCollection.find({}, { projection: { _id: 1 } });

    for await (const targetDocument of targetIdCursor) {
      if (!sourceIdSet.has(String(targetDocument._id))) {
        const deleteResult = await targetCollection.deleteOne({ _id: targetDocument._id });
        deletedDocuments += deleteResult.deletedCount || 0;
      }
    }

    logger.log(`-> Replace mode cleanup removed ${deletedDocuments} stale target document(s).`);
  }

  logger.log('-> Result: Collection migration completed successfully.');

  return {
    collectionName,
    totalDocuments,
    migratedDocuments,
    batchesWritten,
    deletedDocuments,
  };
}

async function migrateDiscoveredCollections({
  sourceDb,
  targetDb,
  discovery,
  batchSize = DEFAULT_BATCH_SIZE,
  mode = 'insert',
  logger = console,
}) {
  logger.log('\n== STEP 3: MIGRATING ALL DISCOVERED COLLECTIONS ==');
  logger.log('-> Why: Sprint 3 scales the proven single-collection loop across the full discovered source database.');

  const results = [];

  for (let index = 0; index < discovery.length; index += 1) {
    const collectionDiscovery = discovery[index];
    logger.log(`\n== COLLECTION ${index + 1}/${discovery.length}: ${collectionDiscovery.name} ==`);
    logger.log(`-> Expected documents from discovery: ${collectionDiscovery.count}`);

    try {
      const result = await migrateCollection({
        sourceDb,
        targetDb,
        collectionName: collectionDiscovery.name,
        batchSize,
        mode,
        logger,
      });
      results.push({ ...result, status: 'success' });
    } catch (error) {
      results.push({
        collectionName: collectionDiscovery.name,
        status: 'failed',
        error: error.message,
        batchNumber: error.batchNumber,
      });
      throw error;
    }
  }

  return results;
}

async function migrateSingleCollection(options = {}) {
  const logger = options.logger || console;
  const config = options.config || loadConfig(options.envPath);
  const collectionName = options.collectionName;
  const batchSize = Number(options.batchSize || DEFAULT_BATCH_SIZE);
  const mode = options.mode || 'insert';
  let sourceClient;
  let targetClient;

  if (!Number.isInteger(batchSize) || batchSize <= 0) {
    throw new Error('Batch size must be a positive integer.');
  }

  logger.log('== STEP 1: PREPARING SINGLE-COLLECTION MIGRATION ==');
  logger.log('-> Why: A targeted migration test reduces risk before migrating every collection.');
  logger.log(`-> Collection: ${collectionName}`);
  logger.log(`-> Batch size: ${batchSize}`);
  logger.log(`-> Migration mode: ${mode}`);

  try {
    logger.log('\n== STEP 2: CONNECTING TO SOURCE AND TARGET ==');
    sourceClient = await connectSource(config, logger);
    targetClient = await connectTarget(config, logger);

    const sourceDb = sourceClient.db();
    const targetDb = targetClient.db();

    logger.log('\n== STEP 3: COPYING DOCUMENTS IN BATCHES ==');
    const result = await migrateCollection({
      sourceDb,
      targetDb,
      collectionName,
      batchSize,
      mode,
      logger,
    });

    logger.log('\n== STEP 4: MIGRATION SUMMARY ==');
    logger.log(`-> Collection: ${result.collectionName}`);
    logger.log(`-> Documents migrated: ${result.migratedDocuments}/${result.totalDocuments}`);
    logger.log(`-> Batches written: ${result.batchesWritten}`);
    logger.log('-> Result: Sprint 2 single-collection migration finished.');

    return result;
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

async function migrateAllCollections(options = {}) {
  const logger = options.logger || console;
  const config = options.config || loadConfig(options.envPath);
  const batchSize = Number(options.batchSize || DEFAULT_BATCH_SIZE);
  const mode = options.mode || 'insert';
  let sourceClient;
  let targetClient;

  if (!Number.isInteger(batchSize) || batchSize <= 0) {
    throw new Error('Batch size must be a positive integer.');
  }

  logger.log('== STEP 1: PREPARING FULL DATABASE MIGRATION ==');
  logger.log('-> Why: We now migrate every collection discovered in the source database.');
  logger.log(`-> Batch size: ${batchSize}`);
  logger.log(`-> Migration mode: ${mode}`);

  try {
    logger.log('\n== STEP 2: CONNECTING TO SOURCE AND TARGET ==');
    sourceClient = await connectSource(config, logger);
    targetClient = await connectTarget(config, logger);

    const sourceDb = sourceClient.db();
    const targetDb = targetClient.db();

    const discovery = await discoverDatabase(sourceDb, logger);
    const migrationResults = await migrateDiscoveredCollections({
      sourceDb,
      targetDb,
      discovery,
      batchSize,
      mode,
      logger,
    });
    const indexResults = await replicateIndexes({ targetDb, discovery, logger });

    logger.log('\n== STEP 5: FULL MIGRATION SUMMARY ==');
    for (const result of migrationResults) {
    logger.log(`-> ${result.collectionName}: ${result.status}, ${result.migratedDocuments}/${result.totalDocuments} document(s), ${result.batchesWritten} batch(es), ${result.deletedDocuments || 0} stale deleted`);
    }
    for (const result of indexResults) {
      logger.log(`-> Indexes for ${result.collectionName}: ${result.created} created, ${result.skipped} skipped`);
    }
    logger.log('-> Result: Sprint 3 full migration and indexing completed.');

    return { discovery, migrationResults, indexResults };
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
  DEFAULT_BATCH_SIZE,
  migrateCollection,
  migrateDiscoveredCollections,
  migrateAllCollections,
  migrateSingleCollection,
};
