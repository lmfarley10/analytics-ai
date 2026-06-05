# Instructor Guide

## Session Strategy

Use the original AJD Mongo developer journey as the teaching lab. Use this guide as the recovery and reference layer.

The live goal is not for every attendee to hand-author every file perfectly. The live goal is for every attendee to understand the AJD MongoDB API path and leave with a working app or a clear reference implementation.

Prioritize outcomes in this order:

1. Working CRUD app backed by AJD through the MongoDB API.
2. Clear understanding of `.env` and connection strings.
3. SQL visibility into JSON data.
4. Migration source-to-target flow.
5. Oracle-enhanced demos such as secure task filtering and flashback.

## Pre-Workshop Checklist

- Send local setup/pre-work before the session.
- Confirm attendees have Node.js 20.19 or newer.
- Confirm Windows attendees have Git Bash available in VS Code.
- Confirm attendees have OCI permissions to use Autonomous JSON Database.
- Confirm the workshop compartment and region are ready.
- Confirm the reference implementation download is available.
- Confirm the downloadable package does not include real `.env`, wallets, `.git`, `.DS_Store`, or `node_modules`.
- Keep a private instructor copy with any demo-only wallet material.
- On workshop day, update AJD ACLs with the venue or attendee public IPs.
- Ask attendees to avoid URI-reserved characters in database passwords when possible.

Useful public IP check:

```bash
curl -s ifconfig.me
```

Minimum OCI policy pattern:

```text
Allow group <workshop-group> to manage autonomous-database-family in compartment <workshop-compartment>
```

## Suggested 90-Minute Flow

- 5 min: Check Node/npm/Git Bash and AI assistant readiness.
- 15 min: Provision AJD and create Mongo-enabled database user.
- 25 min: Follow the original lab to build or review the app.
- 10 min: Use this companion guide to rescue anyone falling behind.
- 10 min: Validate CRUD and explain `.env`.
- 10 min: Show SQL visibility into task JSON.
- 10 min: Demo migration or source-to-target sync.
- 10 min: Demo Oracle-enhanced features if the room is ready.

If time slips, stop building manually and switch to the reference implementation.

## Rescue Decision Tree

If the attendee cannot start the app:

- Check Node/npm.
- Check `.env` location.
- Check AJD ACL.
- Check `MONGO_API_URL`.
- Check whether port 3000 is busy.

If the attendee has too many file edits to recover:

- Switch to the reference implementation.
- Copy their `.env` values into the sanitized reference app.
- Run `npm ci` and `npm start`.

If the attendee cannot connect to AJD:

- Update ACL with current public IP.
- Confirm username/password.
- Confirm password is URL-encoded.
- Confirm PowerShell did not alter `$external`.

## Reference Implementation Packaging

Download:

[Mongo AJD Reference Workshop](https://objectstorage.us-chicago-1.oraclecloud.com/p/5_owsQRuZS4LCiseFDEU8itZgU8RuKjPfMfIOyAs-G42qsUiHuMyvpBuIdXeGT7M/n/idb6enfdcxbl/b/demo-bucket/o/mongo-ajd-reference-workshop.zip)

Recommended attendee package contents:

```text
mongo-ajd-reference/
  .env.example
  todo-app/
  migration-cli/
```

Exclude:

```text
.env
.git/
.DS_Store
node_modules/
wallet/
*.zip
```

Sample `.env.example`:

```env
MONGO_API_URL=
SOURCE_MONGO_API_URL=
TARGET_MONGO_API_URL=
TARGET_ORACLE_USER=
TARGET_ORACLE_PASSWORD=
TARGET_ORACLE_CONNECT_STRING=
TARGET_ORACLE_TNS_ADMIN=
ORACLE_COLLECTION_TABLE=todos
PORT=3000
```

## Instructor Demo Script

Use this flow when the class needs to see the full story quickly:

1. Start the reference app.
2. Show CRUD against the active AJD MongoDB API URL.
3. Switch to **Source Mongo API**.
4. Create one task for `demo-user-1` and one task for `demo-user-2`.
5. Switch to **Target AJD Mongo API** and show the target does not yet contain the new source tasks.
6. Run the migration sync.
7. Show target data now matches source data.
8. Open Secure Tasks and switch between demo users.
9. Show AJD Insights.
10. Show Flashback Time Travel with a recent timestamp.

Instructor note: source-to-target sync and `POST /api/migration/todos` are reference-app conveniences. They are not the core attendee build path.

## SQL Setup Notes

Run:

```bash
cd todo-app
npm run oracle:setup
```

This applies SQL files from `todo-app/sql` and sets up optional Oracle demo objects.

If `DBMS_RLS` is unavailable, the VPD attachment may fail. The app can still demonstrate database-side filtering through explicit `CLIENT_IDENTIFIER` logic, so do not let this block the workshop.

## Migration CLI Notes

Basic checks:

```bash
cd migration-cli
npm ci
npm test
npm start -- discover
npm start -- validate
```

Migration:

```bash
npm start -- migrate --collection todos --batch-size 100
```

Use replace only for demos:

```bash
npm start -- migrate --collection todos --batch-size 100 --mode replace
```

`--mode replace` deletes stale target tasks to make target match source exactly.

## Instructor Talking Points

- AJD supports familiar MongoDB-style application development through the MongoDB API.
- The same JSON data can be visible through SQL.
- The reference implementation is a safety net, not a shortcut around the learning objectives.
- Migration can be explained incrementally: discover, validate, migrate, then explore target data.
- Oracle-native features can be layered on after the app is running.

## Do Not Show On Screen

- Real passwords.
- Real `.env` values.
- Wallet contents.
- Private pre-authenticated download URLs.
- Customer or attendee data.
