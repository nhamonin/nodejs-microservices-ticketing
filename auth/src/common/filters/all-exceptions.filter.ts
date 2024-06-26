import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { BaseError, SerializedError } from '../errors/BaseError';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let errors: SerializedError[] = [{ message: 'Something went wrong.' }];
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof BaseError) {
      statusCode = exception.statusCode;
      errors = exception.serializeErrors();

      if (process.env.NODE_ENV !== 'test') {
        this.logger.error(
          `${exception.constructor.name}: ${exception.message}`,
        );
      }
    } else if (exception instanceof Error) {
      if (process.env.NODE_ENV !== 'test') {
        this.logger.error(exception.message, exception.stack);
      }
    }

    response.status(statusCode).json({
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      errors,
    });
  }
}
