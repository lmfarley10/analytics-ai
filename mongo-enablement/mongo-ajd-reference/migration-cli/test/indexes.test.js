const assert = require('node:assert/strict');
const test = require('node:test');

const { buildCreateIndexOptions, isIdIndex, replicateIndexesForCollection } = require('../src/indexes');

test('isIdIndex identifies the default _id index', () => {
  assert.equal(isIdIndex({ name: '_id_', key: { _id: 1 } }), true);
  assert.equal(isIdIndex({ name: 'text_1', key: { text: 1 } }), false);
});

test('buildCreateIndexOptions keeps supported options and omits metadata', () => {
  const options = buildCreateIndexOptions({
    v: 2,
    key: { text: 1 },
    name: 'text_1',
    unique: true,
    sparse: true,
    ns: 'db.todos',
  });

  assert.deepEqual(options, {
    name: 'text_1',
    unique: true,
    sparse: true,
  });
});

test('replicateIndexesForCollection skips _id and creates custom indexes', async () => {
  const created = [];
  const targetDb = {
    collection: () => ({
      createIndex: async (key, options) => {
        created.push({ key, options });
      },
    }),
  };

  const result = await replicateIndexesForCollection({
    targetDb,
    collectionDiscovery: {
      name: 'todos',
      indexes: [
        { name: '_id_', key: { _id: 1 } },
        { name: 'text_1', key: { text: 1 }, unique: false },
      ],
    },
    logger: { log: () => {} },
  });

  assert.deepEqual(created, [
    { key: { text: 1 }, options: { name: 'text_1', unique: false } },
  ]);
  assert.deepEqual(result, { collectionName: 'todos', created: 1, skipped: 1 });
});