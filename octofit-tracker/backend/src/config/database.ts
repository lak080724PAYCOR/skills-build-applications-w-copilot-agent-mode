import mongoose from 'mongoose';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
const db = mongoose.connection;

let databaseAvailable = false;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
  databaseAvailable = false;
});

export async function connectToDatabase() {
  if (db.readyState === 1) {
    databaseAvailable = true;
    return true;
  }

  try {
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 2000,
    });
    databaseAvailable = true;
    console.log('Connected to octofit_db');
    return true;
  } catch (error) {
    console.warn('Unable to connect to octofit_db, continuing with in-memory seed data.');
    console.warn(error);
    databaseAvailable = false;
    return false;
  }
}

export function isDatabaseAvailable() {
  return databaseAvailable && db.readyState === 1;
}

export async function disconnectDatabase() {
  if (db.readyState !== 0) {
    await mongoose.disconnect();
  }

  databaseAvailable = false;
}

export default db;
