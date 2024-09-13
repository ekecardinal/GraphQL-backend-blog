import { NestFactory } from '@nestjs/core';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import * as cookieParser from 'cookie-parser';
import { Request, Response } from 'express';
import { GraphQLErrorFilter } from 'src/filters/custom-exception.filter';
import { AppModule } from 'src/app.module';

let server: INestApplication;

const bootstrap = async () => {
  if (!server) {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: '*', // Adjust according to your needs
      credentials: true,
      allowedHeaders: [
        'Accept',
        'Authorization',
        'Content-Type',
        'X-Requested-With',
        'apollo-require-preflight',
      ],
      methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    });
    app.use(graphqlUploadExpress({ maxFileSize: 10000000000, maxFiles: 10 }));
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        exceptionFactory: (errors) => {
          const formattedErrors = errors.reduce((accumulator, error) => {
            accumulator[error.property] = Object.values(error.constraints).join(
              ', ',
            );
            return accumulator;
          }, {});
          console.log('formattedErrors123', formattedErrors);
          throw new BadRequestException(formattedErrors);
        },
      }),
    );
    app.useGlobalFilters(new GraphQLErrorFilter());
    server = app;
    await app.init();
  }
  return server;
};

export default async function handler(req: Request, res: Response) {
  const app = await bootstrap();
  app.getHttpAdapter().getInstance().emit('request', req);
  app.getHttpAdapter().getInstance().emit('response', res);
}
