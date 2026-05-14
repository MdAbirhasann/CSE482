import mongoose from 'mongoose';
import { ensureDemoSeeded } from '../utils/demoStore.js';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  const forceDemo = process.env.STORAGE_MODE === 'demo';

  if (forceDemo || !uri) {
    globalThis.lostFindDemoMode = true;
    await ensureDemoSeeded();
    console.log('Demo file-memory store enabled. MongoDB is not required for local submission demo.');
    return null;
  }

  try {
    const connection = await mongoose.connect(uri);
    globalThis.lostFindDemoMode = false;
    console.log(`MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    if (process.env.REQUIRE_MONGODB === 'true') throw error;
    globalThis.lostFindDemoMode = true;
    await ensureDemoSeeded();
    console.warn(`MongoDB connection failed (${error.message}). Demo store enabled so the app can still run.`);
    return null;
  }
};
