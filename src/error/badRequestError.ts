import { HttpStatusCode } from 'axios';
import { CustomError } from './customError';
import { StatusMessages } from './statusCode';

export class BadRequestError extends CustomError {
  constructor(message = StatusMessages.BAD_REQUEST) {
    super(message, HttpStatusCode.BadRequest);
  }
}
