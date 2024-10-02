import { INestApplication } from '@nestjs/common';

import { initTestApp } from '../utils/initTestApp';
import { clearDatabase } from '../utils/clearDatabase';

let app: INestApplication;

beforeAll(async () => {
  app = await initTestApp();
});

beforeEach(async () => {
  await clearDatabase(app);
});

afterAll(async () => {
  await app.close();
  await clearDatabase(app);
});

export { app };
