import { CustomError } from './customError';

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor(public customMessage: string = 'Not Authorized.') {
    super(customMessage);

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.customMessage }];
  }
}