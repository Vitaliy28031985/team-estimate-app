import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
// import { ValidationError } from 'mongoose';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Checking if the error is a Mongoose validation error
    if (exception.name === 'ValidationError') {
      const errors = Object.values(exception.errors).map(
        (err: any) => err.message,
      );

      // Format the error message
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        errors: errors,
      });
    }

    // Handling other exceptions
    response.status(status).json({
      statusCode: status,
      message: exception.message || 'Internal server error',
    });
  }
}
