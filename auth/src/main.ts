import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { AllExceptionsFilter, CustomValidationPipe } from '@nh_tickets/common';

import { AuthModule } from './auth.module';

export async function configureApp(app: INestApplication) {
  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(cookieParser());
}

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  await configureApp(app);
  app.use(morgan('tiny'));
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Ticketing API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/auth', app, document);

  await app.listen(3000, '0.0.0.0');
}

if (require.main === module) {
  bootstrap();
}
