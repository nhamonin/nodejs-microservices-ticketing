import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as dotenv from 'dotenv';

import { AuthModule } from '../../../src/auth.module';
import { configureApp } from '../../../src/main';

dotenv.config({ path: '../../.env' });

export async function initTestApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AuthModule],
  })
    .overrideProvider(ConfigService)
    .useValue({
      get: jest.fn((key: string) => process.env[key]),
    })
    .compile();

  const app = moduleFixture.createNestApplication();

  app.setGlobalPrefix('api');
  await configureApp(app);
  await app.init();

  return app;
}
