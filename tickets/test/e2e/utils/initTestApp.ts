import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as dotenv from 'dotenv';

import { TicketsModule } from '../../../src/tickets.module';
import { configureApp } from '../../../src/main';
import { RabbitMQService } from '../../../src/services/rabbitmq.service';
import { MockRabbitMQService } from '../../mocks/mock-rabbitmq.service';

dotenv.config({ path: '../../.env' });

export async function initTestApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [TicketsModule],
  })
    .overrideProvider(ConfigService)
    .useValue({
      get: jest.fn((key: string) => process.env[key]),
    })
    .overrideProvider(RabbitMQService)
    .useValue(MockRabbitMQService)
    .compile();

  const app = moduleFixture.createNestApplication();

  app.setGlobalPrefix('api');
  await configureApp(app);
  await app.init();

  return app;
}
