import type { ErrorRequestHandler } from 'express';
import { HttpError } from 'http-errors';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const isHttp = err instanceof HttpError;
  const status = isHttp ? err.statusCode || err.status || 500 : 500;
  const message = isHttp ? err.message : 'Something went wrong';

  if (status >= 500) {
    console.error('Unhandled error:', err);
  }

  const response = {
    status,
    message,
    ...(process.env.NODE_ENV !== 'production' && !isHttp
      ? {
          data: {
            message: err instanceof Error ? err.message : 'Unexpected error',
          },
        }
      : {}),
  };

  res.status(status).json(response);
};
