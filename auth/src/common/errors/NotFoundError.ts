import { HttpStatus } from '@nestjs/common';

import { BaseError } from './BaseError';

export class NotFoundError extends BaseError {
  statusCode = HttpStatus.NOT_FOUND;

  constructor(entity?: string) {
    super(entity ? `${entity} not found` : 'Resource not found');

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  public serializeErrors() {
    return [{ message: this.message }];
  }
}
