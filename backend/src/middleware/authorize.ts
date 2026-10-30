import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticate.js';

export function authorize(roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient privileges. Contact atelier administrator.',
        },
      });
    }
    next();
  };
}
