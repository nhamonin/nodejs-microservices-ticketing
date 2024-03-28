import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

interface ValidationErrorResponse {
  message: string;
  field?: string;
}

interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  errors: ValidationErrorResponse[];
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    const responsePayload: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      errors: [],
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      responsePayload.statusCode = status;

      if (this.isValidationError(exception)) {
        responsePayload.errors = exceptionResponse['message'];
      } else {
        responsePayload.errors.push({
          message: exceptionResponse['message'] || 'An error occurred',
        });
      }
    } else {
      responsePayload.errors.push({
        message: 'Internal server error',
      });
    }

    response.status(status).json(responsePayload);
  }

  private isValidationError(exception: HttpException): boolean {
    const response = exception.getResponse();
    return (
      response.hasOwnProperty('message') &&
      Array.isArray(response['message']) &&
      response['message'].every(
        (msg) => typeof msg === 'object' && msg.hasOwnProperty('message'),
      )
    );
  }
}
