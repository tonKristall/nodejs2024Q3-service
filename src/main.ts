import { NestFactory } from '@nestjs/core';
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

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
