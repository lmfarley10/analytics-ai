# Reference Implementation

## Purpose

The reference implementation is the completed app for the original AJD Mongo developer journey. It gives attendees a known-good implementation and gives instructors a reliable demo path.

Use it when:

- An attendee cannot keep up with manual app-building steps.
- Local file edits drift too far from the lab instructions.
- The instructor needs to demo migration or Oracle-enhanced features.
- The class needs a fast reset to a known-good app.

## Download

[Mongo AJD Reference Workshop](https://objectstorage.us-chicago-1.oraclecloud.com/p/5_owsQRuZS4LCiseFDEU8itZgU8RuKjPfMfIOyAs-G42qsUiHuMyvpBuIdXeGT7M/n/idb6enfdcxbl/b/demo-bucket/o/mongo-ajd-reference-workshop.zip)

Download and unzip the package before running the commands in this section.

## Expected Layout

After unzipping the reference package, the workspace should look like this:

```text
mongo-ajd-reference/
  .env.example
  todo-app/
  migration-cli/
```

Do not commit real `.env` files, database wallets, `.git` directories, or `node_modules` folders to this LiveLabs repository.

## Minimal Attendee Configuration

Create `.env` in the reference implementation root:

```bash
cp .env.example .env
```

Set:

```env
MONGO_API_URL=<your AJD MongoDB API URL>
SOURCE_MONGO_API_URL=<your AJD MongoDB API URL>
TARGET_MONGO_API_URL=<your AJD MongoDB API URL>
PORT=3000
```

This runs the app against one AJD database. It is the simplest path for attendees who need the app working quickly.

## Full Instructor Configuration

For source-to-target migration and Oracle SQL demo features, set:

```env
MONGO_API_URL=<default app MongoDB API URL>
SOURCE_MONGO_API_URL=<source MongoDB API URL>
TARGET_MONGO_API_URL=<target AJD MongoDB API URL>
TARGET_ORACLE_USER=<target SQL username>
TARGET_ORACLE_PASSWORD=<target SQL password>
TARGET_ORACLE_CONNECT_STRING=<target service name, for example ajdmongotarget_high>
TARGET_ORACLE_TNS_ADMIN=<absolute path to unzipped target wallet directory>
ORACLE_COLLECTION_TABLE=todos
PORT=3000
```

`TARGET_ORACLE_USER` and `TARGET_ORACLE_PASSWORD` may be derivable from the MongoDB API URL in the reference app, but explicit values are easier to support during a live workshop.

## App Commands

Install and run:

```bash
cd todo-app
npm ci
npm start
```

Apply optional Oracle SQL objects:

```bash
cd todo-app
npm run oracle:setup
```

What the Oracle setup does:

- Runs `node scripts/apply-oracle-sql.js`.
- Loads `.env` from the reference implementation root.
- Connects with the Oracle Node.js driver.
- Applies SQL files from `todo-app/sql`.
- Creates demo objects for dashboard, secure task filtering, and flashback checks.

## Migration CLI Commands

Install and test:

```bash
cd migration-cli
npm ci
npm test
```

Inspect and validate:

```bash
npm start -- discover
npm start -- validate
```

Migrate once:

```bash
npm start -- migrate --collection todos --batch-size 100
```

Upsert into an existing target:

```bash
npm start -- migrate --collection todos --batch-size 100 --mode upsert
```

Replace target contents with source contents:

```bash
npm start -- migrate --collection todos --batch-size 100 --mode replace
```

`--mode replace` deletes stale target tasks. Use it only with workshop/demo data.

## Instructor Demo Flow

1. Start the app.
2. Select **Source Mongo API**.
3. Create a task assigned to `demo-user-1`.
4. Create a task assigned to `demo-user-2`.
5. Switch to **Target AJD Mongo API** and show that the new source tasks are not there yet.
6. Run migration from the app or CLI.
7. Confirm the target now shows the source tasks.
8. Use Secure Tasks to switch between users.
9. Show Oracle AJD Insights and Flashback Time Travel if SQL setup completed.

## What Not To Do

- Do not commit real `.env` files.
- Do not commit wallets.
- Do not commit `node_modules`.
- Do not use `--mode replace` against production or shared data.
- Do not show live credentials on screen.
