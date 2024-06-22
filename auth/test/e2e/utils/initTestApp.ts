import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

import { AuthModule } from '../../../src/auth.module';

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
  app.use(cookieParser());
  await app.init();

  return app;
}
