# Introduction

## About This Companion Guide

This guide is a lightweight companion for the AJD Mongo developer journey workshop:

https://dspdr.github.io/ajd-mgo-journey/workshops/tenancy/index.html?lab=provision-connect

Use the original workshop as the primary hands-on lab. Use this companion guide when you need a fast reference implementation, a recovery path for attendees who fall behind, or instructor-ready troubleshooting notes.

Download the completed reference package:

[Mongo AJD Reference Workshop](https://objectstorage.us-chicago-1.oraclecloud.com/p/5_owsQRuZS4LCiseFDEU8itZgU8RuKjPfMfIOyAs-G42qsUiHuMyvpBuIdXeGT7M/n/idb6enfdcxbl/b/demo-bucket/o/mongo-ajd-reference-workshop.zip)

This guide is intentionally short. It is not a second full lab. It is a workshop cheat sheet.

> **Estimated Time:** 10 minutes for quick start, 20-30 minutes for guided recovery or instructor demo.

## Who Should Use This

- **Attendees:** Use the quick start when your local app is not working and you need a known-good reference.
- **Instructors:** Use the reference implementation and troubleshooting sections to keep the workshop moving.
- **Teaching assistants:** Use the symptom tables to triage common setup and connection issues.

## What You Will Do

- Configure a minimal `.env` file.
- Start the completed To-Do app.
- Validate that the app can read and write task documents through the MongoDB API for Oracle Autonomous JSON Database.
- Optionally apply Oracle SQL objects and run the migration CLI.
- Use the instructor notes to recover common workshop failures.

## Companion Flow

1. Follow the original lab until you provision AJD and capture the MongoDB API connection string.
2. If you fall behind, switch to this guide.
3. Use the reference implementation instead of building every file manually.
4. Keep learning from the original lab while using the working app as your safety net.

## Reference Package Architecture

The downloaded reference package contains:

- `todo-app`: Node.js and Express CRUD app using the MongoDB Node.js driver.
- `migration-cli`: Command-line utility for source-to-target migration.
- `.env.example`: Sanitized configuration template for MongoDB API and optional Oracle SQL access.
- `todo-app/sql`: Optional Oracle SQL setup for instructor demos.

## Prerequisites

- Oracle Cloud access with permission to use Autonomous JSON Database.
- An AJD instance with MongoDB API access enabled.
- A MongoDB API connection string from the original lab.
- Node.js 20.19 or newer.
- npm.
- Git Bash on Windows, or Terminal / VS Code terminal on macOS.

Check your local tools:

```bash
node -v
npm -v
git --version
```

## Important Security Note

Do not share real `.env` files, database wallets, passwords, or connection strings in chat, screenshots, or commits. The reference implementation should use a sanitized `.env.example`; each attendee should create their own local `.env`.

## Acknowledgements

**Author**

- Luke Farley, Senior Cloud Engineer, ONA Data Platform S&E

**Last Updated By/Date**

- Luke Farley, Senior Cloud Engineer, ONA Data Platform S&E, June 2026
