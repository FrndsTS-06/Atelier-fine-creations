import { Request, Response } from 'express';

export function notFound(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `The requested path ${req.originalUrl} does not exist on AURÉLIEN API.`,
    },
    timestamp: new Date().toISOString(),
  });
}
