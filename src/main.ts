import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import * as session from 'express-session';

async function bootstrap() {
  process.env.TZ = 'UTC';

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configure session
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'nest-posts-secret-key-change-in-production',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        httpOnly: true,
      },
    }),
  );

  // Configure JSX view engine
  app.setBaseViewsDir(join(__dirname, '../views'));
  app.setViewEngine('jsx');
  app.engine('jsx', require('express-react-views').createEngine());

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS if needed
  app.enableCors();

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Posts API')
    .setDescription('NestJS Prisma PostgreSQL CRUD Posts API with Soft Delete')
    .setVersion('1.0')
    .addTag('posts')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
  console.log(`Swagger documentation: http://localhost:3000/api`);
}
bootstrap();
