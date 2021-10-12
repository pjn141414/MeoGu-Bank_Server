import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  // multer
  const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use('/public', express.static(join(__dirname, '../public')));

  // swagger
  const config = new DocumentBuilder()
    .setTitle('MeoGu-Bank Server API')
    .setDescription('머구은행 서버 API')
    .setVersion('1.0.0')
    .addTag('')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT Token',
        in: 'header',
      },
      'accesskey',
    )

    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('MeoGu_Bank-api-docs', app, document);

  await app.listen(8000);
}

bootstrap();
