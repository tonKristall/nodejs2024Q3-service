import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  BadRequestException,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import 'dotenv/config';
import { LoggingService } from './logging/logging.service';
import { AllExceptionsFilter } from './filters/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loggingService = app.get<LoggingService>(LoggingService);
  const httpAdapterHost = app.get(HttpAdapterHost);

  const api = yaml.load(
    readFileSync('./doc/api.yaml', 'utf8'),
  ) as OpenAPIObject;
  SwaggerModule.setup('doc', app, api);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: ([error]) => {
        if (error.property === 'refreshToken') {
          throw new UnauthorizedException(Object.values(error.constraints));
        }
        throw new BadRequestException(Object.values(error.constraints));
      },
    }),
  );

  app.useGlobalFilters(
    new AllExceptionsFilter(httpAdapterHost, loggingService),
  );

  process.on('uncaughtException', (err) => {
    loggingService.error('Uncaught Exception: ' + err.message);
  });

  process.on('unhandledRejection', (reason, promise) => {
    loggingService.error(
      'Unhandled Rejection at: ' + promise + ' reason: ' + reason,
    );
  });

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
