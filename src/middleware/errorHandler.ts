import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env.js';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error ${statusCode}]: ${message}`, err.stack);

  res.status(statusCode).json({
    success: false,
    message,
    ...(ENV.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
