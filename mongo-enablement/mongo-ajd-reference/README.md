# Mongo AJD Reference Implementation

This is the sanitized reference implementation for the Mongo Enablement Companion Guide.

It intentionally excludes:

- Real `.env` files
- Database wallets
- `.git` directories
- `node_modules`

## Quick Start

Create a local `.env`:

```bash
cp .env.example .env
```

Set at least:

```env
MONGO_API_URL=<your AJD MongoDB API URL>
SOURCE_MONGO_API_URL=<your AJD MongoDB API URL>
TARGET_MONGO_API_URL=<your AJD MongoDB API URL>
PORT=3000
```

Run the app:

```bash
cd todo-app
npm ci
npm start
```

Open:

```text
http://localhost:3000
```

See `../mongo-companion-guide/workshops/tenancy/index.html` for the LiveLabs companion guide.
