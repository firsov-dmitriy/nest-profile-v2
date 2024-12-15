import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();

  app.use(bodyParser.json());

  app.setGlobalPrefix('api', { exclude: ['api'] });
  const configSwagger = new DocumentBuilder()
    .setTitle('Nest Profile')
    .setDescription('This TODO: description')
    .setVersion('0.1')
    .addTag('Nest')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api/swagger', app, swaggerDocument, {
    jsonDocumentUrl: 'api/docs',
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
