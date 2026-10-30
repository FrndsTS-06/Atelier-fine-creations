import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('💎 Connected to AURÉLIEN Database via Prisma.');
  } catch (error) {
    console.error('Database connection error:', error);
  }
}
