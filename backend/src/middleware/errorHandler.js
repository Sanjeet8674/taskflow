import { AppError } from '../utils/AppError.js';
import { config } from '../config/env.js';

export function notFoundHandler(_req, _res, next) {
  next(new AppError('Route not found', 404));
}

export function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const payload = {
    message: err.message || 'Internal server error',
  };

  if (err.details) {
    payload.details = err.details;
  }

  if (config.nodeEnv === 'development' && statusCode === 500) {
    payload.stack = err.stack;
  }

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json(payload);
}
