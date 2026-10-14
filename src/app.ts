import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRouter from './routes/index.js';
import { errorHandler, AppError } from './middleware/errorHandler.js';
import { ENV } from './config/env.js';

export function createApp() {
  const app = express();

  // Security & Utility Middleware
  app.use(helmet());
  app.use(
    cors({
      origin: [ENV.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
    })
  );
  app.use(morgan(ENV.NODE_ENV === 'development' ? 'dev' : 'combined'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Root welcome route
  app.get('/', (_req, res) => {
    res.status(200).json({
      name: 'CraveCraft Food Ordering REST API',
      version: '1.0.0',
      docs: '/api/health',
      endpoints: {
        health: '/api/health',
        foods: '/api/foods',
        categories: '/api/categories',
        orders: '/api/orders',
        auth: '/api/auth',
      },
    });
  });

  // Mount API router
  app.use('/api', apiRouter);

  // 404 Catch-All Handler
  app.use((req, _res, next) => {
    next(new AppError(`Endpoint not found: ${req.method} ${req.originalUrl}`, 404));
  });

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
}
