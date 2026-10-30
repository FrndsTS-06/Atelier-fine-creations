import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load backend .env directly regardless of working directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config(); // Also read cwd if present

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1).default('file:./dev.db'),
  JWT_SECRET: z.string().min(8, 'JWT_SECRET must be at least 8 characters').default('aurelien-atelier-fallback-jwt-secret-key-32b'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  ADMIN_DEFAULT_EMAIL: z.string().email().default('admin@aurelien.gold'),
  ADMIN_DEFAULT_PASSWORD: z.string().min(6).default('AdminPassword123!'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variable configuration:');
  console.error(parsedEnv.error.flatten().fieldErrors);
  throw new Error('Environment variable validation failure.');
}

export const ENV = parsedEnv.data;
