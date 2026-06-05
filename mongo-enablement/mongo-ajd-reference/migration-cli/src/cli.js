#!/usr/bin/env node

const { Command } = require('commander');
const { discoverSource } = require('./discover');
const { loadConfig } = require('./connect');
const { migrateAllCollections, migrateSingleCollection } = require('./migrate');
const { validateMigration } = require('./validate');
const packageJson = require('../package.json');

const program = new Command();

program
  .name('MongoVibeAssist_Migrator')
  .description('Demonstration-first MongoDB to Oracle AJD migration CLI.')
  .version(packageJson.version);

program
  .command('discover')
  .description('Connect to the source MongoDB and discover collections, counts, and indexes.')
  .option('--env <path>', 'Path to environment file. Defaults to root ../.env from migration-cli.')
  .action(async (options) => {
    try {
      const config = loadConfig(options.env);
      await discoverSource({ config });
    } catch (error) {
      console.error('\n== DISCOVERY FAILED ==');
      console.error(`-> Error: ${error.message}`);
      process.exitCode = 1;
    }
  });

program
  .command('migrate')
  .description('Migrate one collection or all discovered collections to the AJD target.')
  .option('-c, --collection <name>', 'Collection name to migrate. Omit to migrate all discovered collections.')
  .option('-b, --batch-size <number>', 'Documents per batch.', '100')
  .option('-m, --mode <mode>', 'Write mode: insert, upsert, or replace. Use replace to make target match source exactly.', 'insert')
  .option('--env <path>', 'Path to environment file. Defaults to root ../.env from migration-cli.')
  .action(async (options) => {
    try {
      const config = loadConfig(options.env);
      if (options.collection) {
        await migrateSingleCollection({
          config,
          collectionName: options.collection,
          batchSize: Number(options.batchSize),
          mode: options.mode,
        });
      } else {
        await migrateAllCollections({
          config,
          batchSize: Number(options.batchSize),
          mode: options.mode,
        });
      }
    } catch (error) {
      console.error('\n== MIGRATION FAILED ==');
      console.error(`-> Error: ${error.message}`);
      process.exitCode = 1;
    }
  });

program
  .command('validate')
  .description('Validate source and target collection counts after migration.')
  .option('--env <path>', 'Path to environment file. Defaults to root ../.env from migration-cli.')
  .action(async (options) => {
    try {
      const config = loadConfig(options.env);
      await validateMigration({ config });
    } catch (error) {
      console.error('\n== VALIDATION FAILED ==');
      console.error(`-> Error: ${error.message}`);
      process.exitCode = 1;
    }
  });

program.parseAsync(process.argv);
