const { connectSource, loadConfig } = require('./connect');

async function discoverDatabase(db, logger = console) {
  logger.log('\n== STEP 3: DISCOVERING SOURCE COLLECTIONS ==');
  logger.log('-> Why: We need collection names, counts, indexes, and sample fields before migration planning.');

  const collections = await db.listCollections({}, { nameOnly: true }).toArray();
  logger.log(`-> Result: Found ${collections.length} collection(s).`);

  const discovery = [];

  for (const collectionInfo of collections) {
    const collectionName = collectionInfo.name;
    const collection = db.collection(collectionName);

    logger.log(`\n== COLLECTION DISCOVERY: ${collectionName} ==`);
    logger.log('-> Counting documents so we can estimate migration work.');
    const count = await collection.countDocuments();
    logger.log(`-> Document count: ${count}`);

    logger.log('-> Reading index definitions so the target can preserve query behavior.');
    const indexes = await collection.indexes();
    logger.log(`-> Index count: ${indexes.length}`);

    logger.log('-> Sampling one document for top-level schema hints.');
    const sample = await collection.findOne({});
    const sampleFields = sample ? Object.keys(sample) : [];
    logger.log(`-> Sample fields: ${sampleFields.length ? sampleFields.join(', ') : '<collection empty>'}`);

    discovery.push({
      name: collectionName,
      count,
      indexes,
      sampleFields,
    });
  }

  return discovery;
}

async function discoverSource(options = {}) {
  const logger = options.logger || console;
  const config = options.config || loadConfig(options.envPath);
  let client;

  logger.log('== STEP 1: LOADING MIGRATION CONFIGURATION ==');
  logger.log('-> Why: The migrator needs source and target Mongo API URLs before discovery.');
  logger.log(`-> Source URI: ${config.maskedSourceUri}`);
  logger.log(`-> Target URI: ${config.maskedTargetUri}`);
  logger.log('-> Result: Configuration loaded without exposing secrets.');

  try {
    logger.log('\n== STEP 2: CONNECTING TO SOURCE MONGODB ==');
    client = await connectSource(config, logger);
    const db = client.db();

    const discovery = await discoverDatabase(db, logger);

    logger.log('\n== STEP 4: DISCOVERY SUMMARY ==');
    for (const item of discovery) {
      logger.log(`-> ${item.name}: ${item.count} document(s), ${item.indexes.length} index(es)`);
    }

    logger.log('-> Result: Source discovery completed successfully.');
    return discovery;
  } finally {
    if (client) {
      await client.close();
      logger.log('\n== CLEANUP: SOURCE CONNECTION CLOSED ==');
    }
  }
}

module.exports = {
  discoverDatabase,
  discoverSource,
};