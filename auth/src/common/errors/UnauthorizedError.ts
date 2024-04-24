import { HttpStatus } from '@nestjs/common';

import { BaseError } from './BaseError';

export class UnauthorizedError extends BaseError {
  statusCode = HttpStatus.UNAUTHORIZED;

  constructor(message: string = 'Unauthorized') {
    super(message);

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  public serializeErrors() {
    return [{ message: this.message }];
  }
}
