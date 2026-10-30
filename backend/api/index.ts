import { createApp } from '../src/app.js';
import { connectDatabase } from '../src/config/database.js';

let isConnected = false;
const app = createApp();

export default async function handler(req: any, res: any) {
  if (!isConnected) {
    try {
      await connectDatabase();
      isConnected = true;
    } catch (err) {
      console.error('Database connection error in Vercel serverless function:', err);
    }
  }
  return app(req, res);
}

