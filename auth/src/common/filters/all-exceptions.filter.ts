import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

import { BaseError, SerializedError } from '../errors/BaseError';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let errors: SerializedError[] = [{ message: 'Something went wrong' }];
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof BaseError) {
      statusCode = exception.statusCode;
      errors = exception.serializeErrors();
    }

    response.status(statusCode).json({
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      errors,
    });
  }
}
