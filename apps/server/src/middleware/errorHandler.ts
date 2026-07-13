import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode: number = 500,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  if (statusCode >= 500) {
    logger.error(`[${statusCode}] ${message}`, { stack: err.stack });
  } else {
    logger.warn(`[${statusCode}] ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: err instanceof AppError ? err.errors : undefined,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError('Resource not found', 404));
};
