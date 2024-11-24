import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import { LoggingService } from '../logging/logging.service';
import { Response } from 'express';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly loggingService: LoggingService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    if (exception instanceof HttpException) {
      const response = ctx.getResponse<Response>();
      const statusCode = exception.getStatus();
      response.status(statusCode).json(exception.getResponse());
    } else {
      const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      const internalServerError = new InternalServerErrorException();
      const responseBody = {
        statusCode: internalServerError.getStatus(),
        message: 'Internal Server Error',
      };

      httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
      this.loggingService.error({
        message: exception.toString(),
      });
    }
  }
}
