import { MongoClient, Db } from 'mongodb';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const uri = process.env.MONGODB_URI;
const dbName = 'SauceLabsAI';

if (!uri) {
  throw new Error('MONGODB_URI not set in .env file');
}

let client: MongoClient;
let db: Db;

export async function connectToMongo() {
  if (!client) {
    client = new MongoClient(uri as string);
    await client.connect();
    db = client.db(dbName);
  }
  return db;
}

export async function closeMongoConnection() {
  if (client) {
    await client.close();
    client = undefined as any;
    db = undefined as any;
  }
}
