import { Request, Response, NextFunction } from 'express';

// In-memory token bucket rate limiter for zero-dependency local / production deployment
interface RateRecord {
  count: number;
  resetTime: number;
}

const ipRequestMap = new Map<string, RateRecord>();

export function resetRateLimits() {
  ipRequestMap.clear();
}

export function rateLimiter(options: { maxRequests: number; windowMs: number }) {
  return (req: Request, res: Response, next: NextFunction) => {
    // In automated testing or development environments, bypass rate limiter so developers aren't locked out
    if (
      process.env.NODE_ENV === 'test' ||
      process.env.NODE_ENV === 'development' ||
      (process.env.NODE_ENV !== 'production' && req.headers['x-test-bypass'] === 'true')
    ) {
      return next();
    }

    const ip = req.ip || req.socket.remoteAddress || 'unknown-client';
    const now = Date.now();
    const record = ipRequestMap.get(ip);

    if (!record || now > record.resetTime) {
      ipRequestMap.set(ip, {
        count: 1,
        resetTime: now + options.windowMs,
      });
      return next();
    }

    if (record.count >= options.maxRequests) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests dispatched. Please pause for a moment.',
        },
      });
    }

    record.count += 1;
    next();
  };
}
