import { Request, Response } from 'express';
import { prisma } from '../../config/database.js';

export async function getHealthStatus(req: Request, res: Response) {
  let dbStatus = 'connected';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    dbStatus = 'disconnected';
  }

  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      service: 'AURÉLIEN Haute Joaillerie Core API',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: dbStatus,
    },
  });
}
