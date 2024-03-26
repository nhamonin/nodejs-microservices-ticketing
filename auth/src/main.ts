import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Ticketing API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('auth_api', app, document);

  // Initialize the HTTP server
  await app.listen(3000, '0.0.0.0');

  // Initialize the microservice
  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
      transport: Transport.TCP,
      options: {
        port: 3001,
      },
    });

  await microservice.listen();
}

bootstrap();
