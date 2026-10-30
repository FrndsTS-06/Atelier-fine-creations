import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { corsOptions } from './config/cors.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

// Import Routes
import healthRoutes from './modules/health/health.routes.js';
import { getHealthStatus } from './modules/health/health.controller.js';
import productRoutes from './modules/products/product.routes.js';
import categoryRoutes from './modules/categories/category.routes.js';
import inquiryRoutes from './modules/inquiries/inquiry.routes.js';
import authRoutes from './modules/auth/auth.routes.js';

export function createApp(): Application {
  const app = express();

  // Defense-in-depth: Disable X-Powered-By header
  app.disable('x-powered-by');

  // Core Security & Utilities
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'https:', 'http:'],
          connectSrc: ["'self'", 'https:', 'http:'],
        },
      },
      crossOriginEmbedderPolicy: false,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    })
  );
  app.use(cors(corsOptions));
  app.use(rateLimiter({ maxRequests: 200, windowMs: 15 * 60 * 1000 }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Caching middleware for public read endpoints
  app.use((req, res, next) => {
    if (req.method === 'GET' && (req.path.startsWith('/api/products') || req.path.startsWith('/api/categories'))) {
      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');
    }
    next();
  });

  // Root welcome route
  app.get('/', (req, res) => {
    res.json({
      brand: 'AURÉLIEN Haute Joaillerie',
      status: 'Online',
      documentation: '/docs',
      health: '/api/health',
    });
  });

  // Direct Health Check Endpoint: GET /api/health
  app.get('/api/health', getHealthStatus);

  // REST API v1 Routing
  const apiRouter = express.Router();
  apiRouter.use('/health', healthRoutes);
  apiRouter.use('/products', productRoutes);
  apiRouter.use('/categories', categoryRoutes);
  apiRouter.use('/inquiries', inquiryRoutes);
  apiRouter.use('/auth', authRoutes);

  app.use('/api/v1', apiRouter);
  app.use('/api', apiRouter); // Support both /api/... and /api/v1/...

  // 404 & Global Error Handling
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
