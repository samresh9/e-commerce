import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const timestamp = new Date().toISOString();

    this.logger.log(request.path);
    this.logger.error(exception);

    if (exception instanceof HttpException) {
      const message: any = exception.getResponse();
      const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;

      return response.status(status).json({
        statusCode: status,
        status: false,
        timestamp,
        message: message.message || message,
        data: message.errors,
      });
    }

    if (exception instanceof QueryFailedError) {
      const err = exception as any;

      // ER_DUP_ENTRY: unique constraint violation in PostgreSQL
      if (err.code === '23505') {
        return response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.BAD_REQUEST,
          status: false,
          timestamp,

          message: err.detail.replace(
            /Key \(([^)]+)\)=\([^)]+\) already exists\./,
            (p1: any) =>
              `${p1
                .replace(/_/g, ' ')
                .replace(/(^\w|\s\w)/g, (m: any) =>
                  m.toUpperCase(),
                )} already exists.`,
          ),
        });
      }

      // ER_NO_REFERENCED_ROW_2: foreign key constraint violation
      if (err.code === '23503') {
        return response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.BAD_REQUEST,
          status: false,
          timestamp,
          message: err.detail,
        });
      }
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      status: false,
      timestamp,
      message: 'server error',
    });
  }
}
