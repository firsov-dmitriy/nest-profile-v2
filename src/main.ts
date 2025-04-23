import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { AuthGuard } from './auth/auth.guard';
import { PrismaService } from './prisma/prisma.service';
import { TokenService } from './auth/token.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    origin: 'http://localhost:3000', // frontend
    credentials: true, // 👈 разрешает cookie
  });
  const tokenService = app.get(TokenService);

  const reflector = app.get(Reflector);
  const prismaService = app.get(PrismaService);
  app.useGlobalGuards(new AuthGuard(tokenService, reflector, prismaService));
  app.use(bodyParser.json());
  app.use(cookieParser());

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
    customSiteTitle: 'Backend Generator',
    customfavIcon: 'https://avatars.githubusercontent.com/u/6936373?s=200&v=4',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    ],
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
