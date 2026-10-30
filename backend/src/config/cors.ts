import cors from 'cors';
import { ENV } from './env.js';

export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or dev tools)
    if (!origin) return callback(null, true);

    const allowed = [ENV.CORS_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'];
    if (allowed.includes(origin)) {
      return callback(null, true);
    }

    // In local development, only permit other localhost dev ports
    const isDev = (process.env.NODE_ENV || ENV.NODE_ENV) === 'development';
    if (isDev && (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'))) {
      return callback(null, true);
    }

    return callback(new Error('CORS policy: Not allowed by AURÉLIEN Security Firewall'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
