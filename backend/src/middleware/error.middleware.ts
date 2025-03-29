import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
  status: number;
  message: string;
  errors?: any[];
}

export default function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  let errorResponse: ErrorResponse = {
    status: err.status || 500,
    message: err.message || 'Internal Server Error',
  };

  if (err.errors) {
    errorResponse.errors = err.errors;
  }

  res.status(errorResponse.status).json(errorResponse);
}