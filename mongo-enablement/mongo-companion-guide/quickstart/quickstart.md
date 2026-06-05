# Quick Start Cheat Sheet

## Goal

Get the completed Mongo-compatible To-Do app running quickly so you can continue the workshop even if you could not finish every build step.

## Step 1: Get Your AJD MongoDB API URL

From the original lab, copy the MongoDB API URL for your AJD user.

It should look similar to this:

```text
mongodb://<username>:<password>@<adb-host>:27017/<username>?authMechanism=PLAIN&authSource=$external&ssl=true&retryWrites=false&loadBalanced=true
```

Keep this value private.

## Step 2: Download the Reference Package

Download and unzip the completed app:

[Mongo AJD Reference Workshop](https://objectstorage.us-chicago-1.oraclecloud.com/p/5_owsQRuZS4LCiseFDEU8itZgU8RuKjPfMfIOyAs-G42qsUiHuMyvpBuIdXeGT7M/n/idb6enfdcxbl/b/demo-bucket/o/mongo-ajd-reference-workshop.zip)

Open a terminal in the unzipped reference implementation root before continuing.

## Step 3: Confirm Your Public IP Is Allowed

Your AJD access control list must include your current public IP. If you changed networks, update the ACL before troubleshooting the app.

```bash
curl -s ifconfig.me
```

## Step 4: Configure `.env`

In the reference implementation root, create `.env` from `.env.example`.

```bash
cp .env.example .env
```

For the fastest attendee path, set only these values:

```env
MONGO_API_URL=<your AJD MongoDB API URL>
SOURCE_MONGO_API_URL=<your AJD MongoDB API URL>
TARGET_MONGO_API_URL=<your AJD MongoDB API URL>
PORT=3000
```

Use separate source and target URLs only if your instructor asks you to run the migration demo.

## Step 5: Start the App

```bash
cd todo-app
npm ci
npm start
```

Open:

```text
http://localhost:3000
```

## Step 6: Validate CRUD

In the app:

1. Add a task.
2. Mark it complete.
3. Delete it.

If all three actions work, your MongoDB API connection is working.

## Optional: Apply Oracle SQL Demo Objects

Only run this step if your instructor wants to show Oracle SQL features from the reference app.

Your `.env` must include wallet and target SQL settings:

```env
TARGET_ORACLE_CONNECT_STRING=<target service name, for example ajdmongotarget_high>
TARGET_ORACLE_TNS_ADMIN=<absolute path to unzipped target wallet directory>
TARGET_ORACLE_USER=<target SQL username>
TARGET_ORACLE_PASSWORD=<target SQL password>
ORACLE_COLLECTION_TABLE=todos
```

Then run:

```bash
cd todo-app
npm run oracle:setup
```

## Optional: Run Migration CLI

Use this only when your workshop uses separate source and target AJD connections.

```bash
cd migration-cli
npm ci
npm test
npm start -- discover
npm start -- validate
npm start -- migrate --collection todos --batch-size 100
```

To make the target exactly match the source, including deleting stale target tasks:

```bash
npm start -- migrate --collection todos --batch-size 100 --mode replace
```

## Fast Recovery Checklist

If the app does not start:

- Confirm you are in the `todo-app` directory.
- Confirm `.env` is in the reference implementation root, one level above `todo-app`.
- Confirm `MONGO_API_URL` is present and private.
- Confirm the AJD ACL includes your current public IP.
- Confirm Node.js is 20.19 or newer.
- If port 3000 is busy, set `PORT=3001` in `.env`.
