import { HttpStatus } from '@nestjs/common';

export interface SerializedError {
  message: string;
  field?: string;
}

export abstract class BaseError extends Error {
  abstract statusCode: HttpStatus;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, BaseError.prototype);
  }

  abstract serializeErrors(): SerializedError[];
}
