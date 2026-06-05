const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const { execFile } = require('child_process');
const path = require('path');
const { promisify } = require('util');
const oracleRoutes = require('./oracleRoutes');
require('dotenv').config({ path: '../.env' });

const app = express();
const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_API_URL;
const sourceMongoUrl = process.env.SOURCE_MONGO_API_URL || mongoUrl;
const targetMongoUrl = process.env.TARGET_MONGO_API_URL || mongoUrl;
const todosCollectionName = 'todos';
const execFileAsync = promisify(execFile);
const migrationCliPath = path.resolve(__dirname, '../migration-cli/src/cli.js');
const migrationCliCwd = path.resolve(__dirname, '../migration-cli');
let migrationInProgress = false;

let db;
const mongoClients = new Map();
const mongoDbs = new Map();
global.db = db;

app.use(express.json());
app.use(express.static('public'));
app.use('/api/oracle', oracleRoutes);

function todoCollectionForRole(role) {
  if (!['source', 'target', 'active'].includes(role)) {
    throw new Error('Invalid database role.');
  }

  return mongoDbs.get(role).collection(todosCollectionName);
}

async function listTodosForRole(role) {
  return todoCollectionForRole(role)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
}

async function createTodoForRole(role, req) {
  const text = req.body?.text?.trim();

  if (!text) {
    const error = new Error('Todo text is required');
    error.statusCode = 400;
    throw error;
  }

  const ownerId = (req.get('x-user-id') || 'demo-user-1').trim();

  if (!ownerId) {
    const error = new Error('Task owner is required');
    error.statusCode = 400;
    throw error;
  }

  const todo = {
    text,
    completed: false,
    createdAt: new Date(),
    ownerId,
  };

  const result = await todoCollectionForRole(role).insertOne(todo);

  return {
    _id: result.insertedId,
    ...todo,
  };
}

async function completeTodoForRole(role, id) {
  if (!ObjectId.isValid(id)) {
    const error = new Error('Invalid todo id');
    error.statusCode = 400;
    throw error;
  }

  const result = await todoCollectionForRole(role).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { completed: true } },
    { returnDocument: 'after' }
  );

  if (!result) {
    const error = new Error('Todo not found');
    error.statusCode = 404;
    throw error;
  }

  return result;
}

async function deleteTodoForRole(role, id) {
  if (!ObjectId.isValid(id)) {
    const error = new Error('Invalid todo id');
    error.statusCode = 400;
    throw error;
  }

  const result = await todoCollectionForRole(role).deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    const error = new Error('Todo not found');
    error.statusCode = 404;
    throw error;
  }
}

function handleTodoError(res, action, error) {
  console.error(`Failed to ${action} todo:`, error.message);
  res.status(error.statusCode || 500).json({ error: error.message || `Failed to ${action} todo` });
}

app.get('/api/todos', async (req, res) => {
  try {
    res.json(await listTodosForRole('active'));
  } catch (error) {
    handleTodoError(res, 'fetch', error);
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    res.status(201).json(await createTodoForRole('active', req));
  } catch (error) {
    handleTodoError(res, 'create', error);
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    res.json(await completeTodoForRole('active', req.params.id));
  } catch (error) {
    handleTodoError(res, 'update', error);
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    await deleteTodoForRole('active', req.params.id);
    res.status(204).send();
  } catch (error) {
    handleTodoError(res, 'delete', error);
  }
});

app.get('/api/workshop/:role/todos', async (req, res) => {
  try {
    res.json(await listTodosForRole(req.params.role));
  } catch (error) {
    handleTodoError(res, 'fetch', error);
  }
});

app.post('/api/workshop/:role/todos', async (req, res) => {
  try {
    res.status(201).json(await createTodoForRole(req.params.role, req));
  } catch (error) {
    handleTodoError(res, 'create', error);
  }
});

app.put('/api/workshop/:role/todos/:id', async (req, res) => {
  try {
    res.json(await completeTodoForRole(req.params.role, req.params.id));
  } catch (error) {
    handleTodoError(res, 'update', error);
  }
});

app.delete('/api/workshop/:role/todos/:id', async (req, res) => {
  try {
    await deleteTodoForRole(req.params.role, req.params.id);
    res.status(204).send();
  } catch (error) {
    handleTodoError(res, 'delete', error);
  }
});

app.post('/api/migration/todos', async (req, res) => {
  if (migrationInProgress) {
    return res.status(409).json({
      error: 'Migration already running',
      hint: 'Wait for the current migration sync to finish before starting another one.',
    });
  }

  migrationInProgress = true;

  try {
    const { stdout, stderr } = await execFileAsync(
      process.execPath,
      [
        migrationCliPath,
        'migrate',
        '--collection',
        todosCollectionName,
        '--batch-size',
        '100',
        '--mode',
        'replace',
      ],
      {
        cwd: migrationCliCwd,
        timeout: 120000,
        maxBuffer: 1024 * 1024,
      }
    );

    res.json({
      status: 'ok',
      command: 'migration-cli migrate --collection todos --batch-size 100 --mode replace',
      stdout,
      stderr,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Migration sync failed',
      details: error.stderr || error.stdout || error.message,
      hint: 'Confirm SOURCE_MONGO_API_URL and TARGET_MONGO_API_URL are set in the root .env file.',
    });
  } finally {
    migrationInProgress = false;
  }
});

async function connectDB() {
  if (!mongoUrl) {
    throw new Error('MONGO_API_URL is not set. Please add it to the root .env file.');
  }

  async function connectRole(role, uri) {
    if (!uri) {
      throw new Error(`${role.toUpperCase()} Mongo URL is not configured.`);
    }

    const client = new MongoClient(uri);
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    mongoClients.set(role, client);
    mongoDbs.set(role, client.db());
  }

  await connectRole('active', mongoUrl);
  await connectRole('source', sourceMongoUrl);
  await connectRole('target', targetMongoUrl);

  db = mongoDbs.get('active');
  global.db = db;

  console.log('Connected to active, source, and target MongoDB-compatible databases.');
  return mongoClients.get('active');
}

async function startServer() {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
