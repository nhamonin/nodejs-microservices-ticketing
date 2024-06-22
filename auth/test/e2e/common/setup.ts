import { INestApplication } from '@nestjs/common';

import { initTestApp } from '../utils/initTestApp';
import { clearDatabase } from '../utils/clearDatabase';

let app: INestApplication;

beforeEach(async () => {
  app = await initTestApp();
});

afterEach(async () => {
  await clearDatabase(app);
  await app.close();
});

export { app };
