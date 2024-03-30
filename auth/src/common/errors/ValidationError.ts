import { HttpStatus } from '@nestjs/common';

import { BaseError, SerializedError } from './BaseError';

export class ValidationError extends BaseError {
  statusCode = HttpStatus.BAD_REQUEST;

  constructor(public errors: SerializedError[]) {
    super('Invalid request parameters');

    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => ({
      message: err.message,
      field: err.field,
    }));
  }
}
