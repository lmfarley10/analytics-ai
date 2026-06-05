function isIdIndex(indexDefinition) {
  return indexDefinition.name === '_id_' || JSON.stringify(indexDefinition.key) === JSON.stringify({ _id: 1 });
}

function buildCreateIndexOptions(indexDefinition) {
  const optionKeys = [
    'name',
    'unique',
    'sparse',
    'expireAfterSeconds',
    'partialFilterExpression',
    'collation',
    'wildcardProjection',
    'hidden',
  ];

  const options = {};

  for (const key of optionKeys) {
    if (Object.prototype.hasOwnProperty.call(indexDefinition, key)) {
      options[key] = indexDefinition[key];
    }
  }

  return options;
}

async function replicateIndexesForCollection({ targetDb, collectionDiscovery, logger = console }) {
  const collectionName = collectionDiscovery.name;
  const targetCollection = targetDb.collection(collectionName);
  let created = 0;
  let skipped = 0;

  logger.log(`\n== INDEX REPLICATION: ${collectionName} ==`);
  logger.log('-> Why: Indexes preserve application query performance after migration.');
  logger.log('-> Using: Standard MongoDB createIndex commands against the AJD Mongo API.');

  for (const indexDefinition of collectionDiscovery.indexes || []) {
    if (isIdIndex(indexDefinition)) {
      skipped += 1;
      logger.log('-> Skipping _id_ index because MongoDB/AJD creates it automatically.');
      continue;
    }

    const options = buildCreateIndexOptions(indexDefinition);

    try {
      logger.log(`-> Creating index ${options.name || '<unnamed>'} on ${JSON.stringify(indexDefinition.key)}...`);
      await targetCollection.createIndex(indexDefinition.key, options);
      created += 1;
      logger.log(`-> Result: Index ${options.name || '<unnamed>'} created or already compatible.`);
    } catch (error) {
      logger.log(`-> Warning: Could not create index ${options.name || '<unnamed>'}.`);
      logger.log(`-> Reason: ${error.message}`);
      logger.log('-> Continuing: The data migration remains valid, but this index should be reviewed manually.');
    }
  }

  logger.log(`-> Index summary for ${collectionName}: ${created} created, ${skipped} skipped.`);

  return { collectionName, created, skipped };
}

async function replicateIndexes({ targetDb, discovery, logger = console }) {
  logger.log('\n== STEP 4: REPLICATING INDEX DEFINITIONS ==');
  logger.log('-> Why: After copying documents, we recreate compatible source indexes on the AJD target.');

  const results = [];

  for (const collectionDiscovery of discovery) {
    results.push(await replicateIndexesForCollection({ targetDb, collectionDiscovery, logger }));
  }

  logger.log('-> Result: Index replication phase completed. Review warnings above, if any.');
  return results;
}

module.exports = {
  buildCreateIndexOptions,
  isIdIndex,
  replicateIndexes,
  replicateIndexesForCollection,
};