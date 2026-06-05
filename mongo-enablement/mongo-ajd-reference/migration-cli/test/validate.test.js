const assert = require('node:assert/strict');
const test = require('node:test');

const { buildValidationRows, calculateTransferPercent, printValidationTable } = require('../src/validate');

test('calculateTransferPercent handles matching counts', () => {
  assert.equal(calculateTransferPercent(6, 6), 100);
  assert.equal(calculateTransferPercent(0, 0), 100);
});

test('calculateTransferPercent reports partial transfers', () => {
  assert.equal(calculateTransferPercent(10, 8), 80);
  assert.equal(calculateTransferPercent(3, 2), 66.67);
});

test('buildValidationRows marks matching collections as PASS', () => {
  const rows = buildValidationRows({
    sourceDiscovery: [
      { name: 'todos', count: 6 },
      { name: 'notes', count: 0 },
    ],
    targetCounts: {
      todos: 6,
      notes: 0,
    },
  });

  assert.deepEqual(rows, [
    {
      collection: 'todos',
      sourceCount: 6,
      targetCount: 6,
      transferPercent: 100,
      status: 'PASS',
    },
    {
      collection: 'notes',
      sourceCount: 0,
      targetCount: 0,
      transferPercent: 100,
      status: 'PASS',
    },
  ]);
});

test('buildValidationRows marks mismatches as REVIEW', () => {
  const rows = buildValidationRows({
    sourceDiscovery: [{ name: 'todos', count: 6 }],
    targetCounts: { todos: 5 },
  });

  assert.equal(rows[0].status, 'REVIEW');
  assert.equal(rows[0].transferPercent, 83.33);
});

test('printValidationTable renders a readable comparison table', () => {
  const logs = [];
  printValidationTable([
    {
      collection: 'todos',
      sourceCount: 6,
      targetCount: 6,
      transferPercent: 100,
      status: 'PASS',
    },
  ], { log: (message) => logs.push(message) });

  assert.ok(logs[0].includes('Collection'));
  assert.ok(logs.some((message) => message.includes('todos')));
  assert.ok(logs.some((message) => message.includes('100.00%')));
  assert.ok(logs.some((message) => message.includes('PASS')));
});