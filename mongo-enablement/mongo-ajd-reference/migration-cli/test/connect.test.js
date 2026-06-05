const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { createMongoClient, loadConfig, maskUri } = require('../src/connect');

function writeTempEnv(contents) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mongovibeassist-'));
  const envPath = path.join(dir, '.env');
  fs.writeFileSync(envPath, contents);
  return envPath;
}

test('loadConfig reads source and target URLs from an env file', () => {
  const envPath = writeTempEnv([
    'SOURCE_MONGO_API_URL=mongodb://source-user:source-pass@example.com/source',
    'TARGET_MONGO_API_URL=mongodb://target-user:target-pass@example.com/target',
  ].join('\n'));

  const config = loadConfig(envPath);

  assert.equal(config.sourceUri, 'mongodb://source-user:source-pass@example.com/source');
  assert.equal(config.targetUri, 'mongodb://target-user:target-pass@example.com/target');
  assert.match(config.maskedSourceUri, /mongodb:\/\/\*\*\*:\*\*\*@example.com\/source/);
  assert.match(config.maskedTargetUri, /mongodb:\/\/\*\*\*:\*\*\*@example.com\/target/);
});

test('loadConfig throws when required variables are missing', () => {
  const envPath = writeTempEnv('SOURCE_MONGO_API_URL=mongodb://example.com/source\n');

  assert.throws(
    () => loadConfig(envPath),
    /Missing required environment variable\(s\): TARGET_MONGO_API_URL/
  );
});

test('createMongoClient returns a MongoClient without connecting', () => {
  const client = createMongoClient('mongodb://localhost:27017/test');

  assert.equal(typeof client.connect, 'function');
  assert.equal(typeof client.close, 'function');
});

test('maskUri hides credentials', () => {
  const masked = maskUri('mongodb://user:password@example.com/database');

  assert.equal(masked, 'mongodb://***:***@example.com/database');
});