import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from 'axios';
import { ZodError, ZodIssue } from 'zod';
import logger from '../libs/logger';
import { NotFoundError } from '../error/notFoundError';
import { ValidationError } from '../error/validationError';

function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.error(err);
  let errorMessage: string;
  let statusCode: number = HttpStatusCode.InternalServerError;

  if (err instanceof ZodError) {
    const errorString = err.errors
      .map((issue: ZodIssue) => {
        const path = issue.path.join('.');
        const { code, message } = issue;
        let details = `code: ${code}, path: ${path}, message: ${message}`;

        if ('expected' in issue && 'received' in issue) {
          details += `, expected: ${(issue as any).expected}, received: ${(issue as any).received}`;
        }
        return details;
      })
      .join('; ');
    errorMessage = `Validation Error: ${errorString}`;
    statusCode = HttpStatusCode.BadRequest;
  } else if (err instanceof NotFoundError) {
    errorMessage = err.message;
    statusCode = HttpStatusCode.NotFound;
  } else if (err instanceof ValidationError) {
    errorMessage = err.message;
    statusCode = HttpStatusCode.BadRequest;
  } else if (err instanceof Error) {
    const cleanedErrorMessage = err
      .toString()
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\\"/g, '"')
      .trim();
    errorMessage = cleanedErrorMessage;
    if ((err as any).statusCode) {
      statusCode = (err as any).statusCode;
    }
  } else {
    errorMessage = 'An unknown error occurred.';
  }
  res.status(statusCode).json({ statusCode, message: errorMessage });
  next();
}

export default errorHandler;
