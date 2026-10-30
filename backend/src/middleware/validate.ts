import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';

export function validate(schema: ZodTypeAny) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid payload submitted to atelier.',
            details: error.errors.map((err) => ({
              field: err.path.join('.'),
              issue: err.message,
            })),
          },
        });
      }
      next(error);
    }
  };
}

export function validateQuery(schema: ZodTypeAny) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = await schema.parseAsync(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'QUERY_VALIDATION_ERROR',
            message: 'Invalid query parameters provided.',
            details: error.errors.map((err) => ({
              field: err.path.join('.'),
              issue: err.message,
            })),
          },
        });
      }
      next(error);
    }
  };
}
