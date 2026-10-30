import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('⚠️ Unhandled Exception:', err);

  const isProd = process.env.NODE_ENV === 'production';
  const statusCode = err.statusCode || 500;
  
  // In production, mask internal 500 errors to prevent secret leakage or stack traces
  const safeMessage =
    isProd && statusCode === 500
      ? 'An internal atelier server error occurred. Please contact concierge.'
      : err.message || 'Internal atelier server error occurred.';

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: safeMessage,
    },
    timestamp: new Date().toISOString(),
  });
}

