const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.fetchAsString = [oracledb.CLOB];

function getCredentialsFromMongoUrl(mongoUrl) {
  if (!mongoUrl) {
    return {};
  }

  const parsed = new URL(mongoUrl);
  return {
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
  };
}

function getOracleConfig() {
  const mongoDerived = getCredentialsFromMongoUrl(process.env.TARGET_MONGO_API_URL);

  return {
    user: process.env.TARGET_ORACLE_USER || mongoDerived.user,
    password: process.env.TARGET_ORACLE_PASSWORD || mongoDerived.password,
    connectString: process.env.TARGET_ORACLE_CONNECT_STRING || 'ajdmongotarget_high',
    configDir: process.env.TARGET_ORACLE_TNS_ADMIN,
    collectionTable: process.env.ORACLE_COLLECTION_TABLE || 'todos',
  };
}

async function getOracleConnection() {
  const config = getOracleConfig();

  if (!config.user || !config.password) {
    throw new Error('Oracle SQL credentials are not configured. Set TARGET_ORACLE_USER/TARGET_ORACLE_PASSWORD or TARGET_MONGO_API_URL.');
  }

  if (!config.configDir) {
    throw new Error('Oracle wallet path is not configured. Set TARGET_ORACLE_TNS_ADMIN to the unzipped target wallet directory.');
  }

  return oracledb.getConnection({
    user: config.user,
    password: config.password,
    connectString: config.connectString,
    configDir: config.configDir,
  });
}

module.exports = {
  getCredentialsFromMongoUrl,
  getOracleConfig,
  getOracleConnection,
};
