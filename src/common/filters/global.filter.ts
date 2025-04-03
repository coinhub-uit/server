import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(HttpException, QueryFailedError)
export class GlobalFilter implements ExceptionFilter {
  catch(exception: HttpException | QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status: number;

    switch (exception.constructor) {
      case HttpException: {
        status = (exception as HttpException).getStatus();
        break;
      }
      case QueryFailedError: {
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        break;
      }
      default: {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        break;
      }
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      error: exception.message,
    });
  }
}
