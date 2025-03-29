// src/middleware/validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

type ValidationSchema = {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
};

export const validate = (schemas: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }));
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      } else {
        next(error);
      }
    }
  };
};