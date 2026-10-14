import mongoose from 'mongoose';
import { ENV } from './env.js';

let isDbConnected = false;

export async function connectDB(): Promise<boolean> {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 2500,
    });
    isDbConnected = true;
    console.log(`[MongoDB] Connected to database: ${conn.connection.name}`);
    return true;
  } catch (err: any) {
    isDbConnected = false;
    console.warn(`[MongoDB] Note: MongoDB connection failed (${err.message}). API will run in fallback persistence mode.`);
    return false;
  }
}

export function getDbStatus(): { isConnected: boolean; uri: string } {
  return {
    isConnected: isDbConnected,
    uri: isDbConnected ? ENV.MONGODB_URI : 'in-memory-fallback',
  };
}
