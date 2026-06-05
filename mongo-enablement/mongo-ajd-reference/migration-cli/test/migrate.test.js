const assert = require('node:assert/strict');
const test = require('node:test');

const { migrateCollection, migrateDiscoveredCollections } = require('../src/migrate');

function createAsyncCursor(documents) {
  return {
    batchSize(size) {
      this.requestedBatchSize = size;
      return this;
    },
    async *[Symbol.asyncIterator]() {
      for (const document of documents) {
        yield document;
      }
    },
  };
}

function createMockDb({ sourceDocuments = [] } = {}) {
  const writes = [];
  const cursor = createAsyncCursor(sourceDocuments);
  const targetDocuments = [];

  const sourceCollection = {
    countDocuments: async () => sourceDocuments.length,
    find: () => cursor,
  };

  const targetCollection = {
    insertMany: async (documents, options) => {
      writes.push({ documents, options });
      return { insertedCount: documents.length };
    },
    bulkWrite: async (operations, options) => {
      writes.push({ operations, options });
      return { upsertedCount: operations.length };
    },
    deleteMany: async (filter) => {
      writes.push({ deleteFilter: filter });
      return { deletedCount: 3 };
    },
    find: () => createAsyncCursor(targetDocuments),
    deleteOne: async (filter) => {
      writes.push({ deleteOneFilter: filter });
      return { deletedCount: 1 };
    },
  };

  return {
    sourceDb: {
      collection: () => sourceCollection,
    },
    targetDb: {
      collection: () => targetCollection,
    },
    writes,
    cursor,
  };
}

test('migrateCollection reads and writes documents in batches', async () => {
  const sourceDocuments = [
    { _id: 1, text: 'one' },
    { _id: 2, text: 'two' },
    { _id: 3, text: 'three' },
    { _id: 4, text: 'four' },
    { _id: 5, text: 'five' },
  ];

  const { sourceDb, targetDb, writes, cursor } = createMockDb({ sourceDocuments });
  const logs = [];
  const logger = { log: (message) => logs.push(message) };

  const result = await migrateCollection({
    sourceDb,
    targetDb,
    collectionName: 'todos',
    batchSize: 2,
    logger,
  });

  assert.equal(cursor.requestedBatchSize, 2);
  assert.equal(writes.length, 3);
  assert.deepEqual(writes.map((write) => write.documents.length), [2, 2, 1]);
  assert.deepEqual(writes.map((write) => write.options), [
    { ordered: false },
    { ordered: false },
    { ordered: false },
  ]);
  assert.deepEqual(result, {
    collectionName: 'todos',
    totalDocuments: 5,
    migratedDocuments: 5,
    batchesWritten: 3,
    deletedDocuments: 0,
  });
  assert.ok(logs.some((message) => message.includes('Wrote batch 3/3')));
});

test('migrateCollection handles empty collections without insertMany', async () => {
  const { sourceDb, targetDb, writes } = createMockDb({ sourceDocuments: [] });
  const logger = { log: () => {} };

  const result = await migrateCollection({
    sourceDb,
    targetDb,
    collectionName: 'empty_collection',
    batchSize: 10,
    logger,
  });

  assert.equal(writes.length, 0);
  assert.deepEqual(result, {
    collectionName: 'empty_collection',
    totalDocuments: 0,
    migratedDocuments: 0,
    batchesWritten: 0,
    deletedDocuments: 0,
  });
});

test('migrateCollection upserts documents when mode is upsert', async () => {
  const sourceDocuments = [
    { _id: 1, text: 'one' },
    { _id: 2, text: 'two' },
  ];

  const { sourceDb, targetDb, writes } = createMockDb({ sourceDocuments });
  const logger = { log: () => {} };

  const result = await migrateCollection({
    sourceDb,
    targetDb,
    collectionName: 'todos',
    batchSize: 10,
    mode: 'upsert',
    logger,
  });

  assert.equal(writes.length, 1);
  assert.deepEqual(writes[0].options, { ordered: false });
  assert.deepEqual(writes[0].operations, [
    {
      replaceOne: {
        filter: { _id: 1 },
        replacement: { _id: 1, text: 'one' },
        upsert: true,
      },
    },
    {
      replaceOne: {
        filter: { _id: 2 },
        replacement: { _id: 2, text: 'two' },
        upsert: true,
      },
    },
  ]);
  assert.equal(result.migratedDocuments, 2);
});

test('migrateCollection replace mode deletes target documents missing from source', async () => {
  const sourceDocuments = [
    { _id: 1, text: 'one' },
    { _id: 2, text: 'two' },
  ];

  const writes = [];
  const sourceDb = {
    collection() {
      return {
        countDocuments: async () => sourceDocuments.length,
        find: () => createAsyncCursor(sourceDocuments),
      };
    },
  };
  const targetDb = {
    collection() {
      return {
        bulkWrite: async (operations, options) => {
          writes.push({ operations, options });
        },
        find: () => createAsyncCursor([{ _id: 1 }, { _id: 2 }, { _id: 999 }]),
        deleteOne: async (filter) => {
          writes.push({ deleteOneFilter: filter });
          return { deletedCount: 1 };
        },
      };
    },
  };
  const logger = { log: () => {} };

  const result = await migrateCollection({
    sourceDb,
    targetDb,
    collectionName: 'todos',
    batchSize: 10,
    mode: 'replace',
    logger,
  });

  assert.deepEqual(writes[0].operations.map((operation) => operation.replaceOne.filter._id), [1, 2]);
  assert.deepEqual(writes[1].deleteOneFilter, { _id: 999 });
  assert.equal(result.deletedDocuments, 1);
});

test('migrateCollection replace mode clears target when source is empty', async () => {
  const { sourceDb, targetDb, writes } = createMockDb({ sourceDocuments: [] });
  const logger = { log: () => {} };

  const result = await migrateCollection({
    sourceDb,
    targetDb,
    collectionName: 'todos',
    batchSize: 10,
    mode: 'replace',
    logger,
  });

  assert.deepEqual(writes, [{ deleteFilter: {} }]);
  assert.equal(result.deletedDocuments, 3);
});

test('migrateDiscoveredCollections loops over discovery results', async () => {
  const sourceData = {
    todos: [{ _id: 1 }, { _id: 2 }],
    notes: [{ _id: 3 }],
  };
  const writes = {};

  const sourceDb = {
    collection(name) {
      const documents = sourceData[name];
      return {
        countDocuments: async () => documents.length,
        find: () => createAsyncCursor(documents),
      };
    },
  };

  const targetDb = {
    collection(name) {
      writes[name] ||= [];
      return {
        insertMany: async (documents) => {
          writes[name].push(...documents);
        },
        bulkWrite: async (operations) => {
          writes[name].push(...operations.map((operation) => operation.replaceOne.replacement));
        },
        deleteMany: async () => ({ deletedCount: 0 }),
        find: () => createAsyncCursor(writes[name].map((document) => ({ _id: document._id }))),
        deleteOne: async () => ({ deletedCount: 1 }),
      };
    },
  };

  const result = await migrateDiscoveredCollections({
    sourceDb,
    targetDb,
    discovery: [
      { name: 'todos', count: 2 },
      { name: 'notes', count: 1 },
    ],
    batchSize: 2,
    logger: { log: () => {}, error: () => {} },
  });

  assert.equal(result.length, 2);
  assert.equal(result[0].status, 'success');
  assert.equal(result[1].status, 'success');
  assert.deepEqual(writes.todos, [{ _id: 1 }, { _id: 2 }]);
  assert.deepEqual(writes.notes, [{ _id: 3 }]);
});
