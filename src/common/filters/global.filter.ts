import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JsonWebTokenError } from '@nestjs/jwt';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(HttpException, JsonWebTokenError, QueryFailedError)
export class GlobalFilter implements ExceptionFilter {
  catch(
    exception: HttpException | QueryFailedError | JsonWebTokenError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status: number;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
    } else if (exception instanceof QueryFailedError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
    } else if (exception instanceof JsonWebTokenError) {
      status = HttpStatus.UNAUTHORIZED;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      error: exception.message,
    });
  }
}
