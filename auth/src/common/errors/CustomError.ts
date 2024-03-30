import { HttpStatus } from '@nestjs/common';

import { BaseError } from './BaseError';

export class CustomError extends BaseError {
  statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

  constructor(message: string = 'An error occurred') {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  public serializeErrors() {
    return [{ message: this.message }];
  }
}
