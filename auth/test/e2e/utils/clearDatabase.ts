import { INestApplication } from '@nestjs/common';

import { PrismaService } from '../../../src/services/prisma.service';

export function clearDatabase(app: INestApplication) {
  const prismaService: PrismaService = app.get(PrismaService);

  return prismaService.clearDatabase();
}
