import { CustomError } from './customError';
import { StatusCodes, StatusMessages } from './statusCode';

export class UnauthorizedError extends CustomError {
  constructor(message = StatusMessages.UNAUTHORIZED) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}
