import { HttpStatus } from '@nestjs/common';

import { BaseError } from './BaseError';

export class ConflictError extends BaseError {
  statusCode = HttpStatus.CONFLICT;

  constructor(message: string = 'Conflict error occurred') {
    super(message);

    Object.setPrototypeOf(this, ConflictError.prototype);
  }

  public serializeErrors() {
    return [{ message: this.message }];
  }
}
