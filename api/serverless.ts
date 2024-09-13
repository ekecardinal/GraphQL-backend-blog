import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import * as cookieParser from 'cookie-parser';

let server: NestExpressApplication;

const bootstrap = async () => {
  if (!server) {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors({
      origin: '*', // Adjust according to your needs
      credentials: true,
    });
    app.use(graphqlUploadExpress({ maxFileSize: 10000000000, maxFiles: 10 }));
    app.use(cookieParser());
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
