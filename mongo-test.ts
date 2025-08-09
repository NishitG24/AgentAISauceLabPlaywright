import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('MONGODB_URI not set in .env file');
}

async function run() {
  const client = new MongoClient(uri as string);
  try {
    await client.connect();
    console.log('Connected to MongoDB!');
    // List databases
    const databasesList = await client.db().admin().listDatabases();
    console.log('Databases:', databasesList.databases.map(db => db.name));
  } catch (err) {
    console.error('MongoDB connection error:', err);
  } finally {
    await client.close();
  }
}

run();
