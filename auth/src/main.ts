import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

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
