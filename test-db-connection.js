require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

async function testConnection() {
  if (!uri) {
    console.error('MONGODB_URI is not defined in the environment variables');
    return;
  }

  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    console.error('Invalid MongoDB URI format. It should start with "mongodb://" or "mongodb+srv://"');
    return;
  }

  console.log('MONGODB_URI format is valid');

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Successfully connected to MongoDB');

    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log('Collections in the database:');
    collections.forEach(collection => console.log(collection.name));

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    await client.close();
  }
}

testConnection();