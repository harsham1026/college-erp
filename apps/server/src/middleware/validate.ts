import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from './errorHandler';

export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.errors.forEach((err) => {
        const key = err.path.join('.');
        if (!errors[key]) errors[key] = [];
        errors[key].push(err.message);
      });
      throw new AppError('Validation failed', 422, errors);
    }
    req.body = result.data;
    next();
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.errors.forEach((err) => {
        const key = err.path.join('.');
        if (!errors[key]) errors[key] = [];
        errors[key].push(err.message);
      });
      throw new AppError('Invalid query parameters', 422, errors);
    }
    req.query = result.data;
    next();
  };
};
