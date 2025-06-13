import { HttpStatusCode } from 'axios';
import { CustomError } from './customError';
import { StatusMessages } from './statusCode';

export class NotFoundError extends CustomError {
  constructor(message = StatusMessages.NOT_FOUND) {
    super(message, HttpStatusCode.NotFound);
  }
}
