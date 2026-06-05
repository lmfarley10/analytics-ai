const path = require('path');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

const DEFAULT_ENV_PATH = path.resolve(__dirname, '../../.env');

function maskUri(uri) {
  if (!uri) {
    return '<missing>';
  }

  try {
    const parsed = new URL(uri);

    if (parsed.password) {
      parsed.password = '***';
    }

    if (parsed.username) {
      parsed.username = '***';
    }

    return parsed.toString();
  } catch {
    return '<configured, hidden>';
  }
}

function loadConfig(envPath = DEFAULT_ENV_PATH) {
  const result = dotenv.config({ path: envPath });

  if (result.error) {
    throw new Error(`Unable to load environment file at ${envPath}`);
  }

  const parsed = result.parsed || {};
  const useProcessEnvFallback = path.resolve(envPath) === DEFAULT_ENV_PATH;
  const sourceUri = parsed.SOURCE_MONGO_API_URL || (useProcessEnvFallback ? process.env.SOURCE_MONGO_API_URL : undefined);
  const targetUri = parsed.TARGET_MONGO_API_URL || (useProcessEnvFallback ? process.env.TARGET_MONGO_API_URL : undefined);

  const missing = [];

  if (!sourceUri) {
    missing.push('SOURCE_MONGO_API_URL');
  }

  if (!targetUri) {
    missing.push('TARGET_MONGO_API_URL');
  }

  if (missing.length) {
    throw new Error(`Missing required environment variable(s): ${missing.join(', ')}`);
  }

  return {
    sourceUri,
    targetUri,
    maskedSourceUri: maskUri(sourceUri),
    maskedTargetUri: maskUri(targetUri),
    envPath,
  };
}

function createMongoClient(uri) {
  return new MongoClient(uri);
}

async function connectClient(label, uri, logger = console) {
  logger.log(`== CONNECTING TO ${label.toUpperCase()} ==`);
  logger.log('-> Why: A live connection is required before discovery or migration can begin.');
  logger.log('-> Using: Official MongoDB Node.js driver.');

  const client = createMongoClient(uri);
  await client.connect();
  await client.db('admin').command({ ping: 1 });

  logger.log(`-> Result: Connected to ${label} and pinged the admin database successfully.`);
  return client;
}

async function connectSource(config = loadConfig(), logger = console) {
  return connectClient('source MongoDB', config.sourceUri, logger);
}

async function connectTarget(config = loadConfig(), logger = console) {
  return connectClient('target AJD Mongo API', config.targetUri, logger);
}

module.exports = {
  DEFAULT_ENV_PATH,
  createMongoClient,
  connectClient,
  connectSource,
  connectTarget,
  loadConfig,
  maskUri,
};