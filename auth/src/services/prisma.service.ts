import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.connectWithRetry();
  }

  async connectWithRetry(attempt: number = 0) {
    const MAX_RETRIES = 7;
    const MILLISECONDS_IN_SECOND = 1000;
    const INITIAL_RETRY_DELAY = 1 * MILLISECONDS_IN_SECOND;

    try {
      await this.$connect();
      this.logger.log('Connected to the database.');
    } catch (_) {
      if (attempt < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
        this.logger.warn(
          `Failed to connect to the database. Retrying in ${delay / MILLISECONDS_IN_SECOND}s...`,
        );
        setTimeout(() => this.connectWithRetry(++attempt), delay);
      } else {
        this.logger.error(
          'Failed to connect to the database after maximum retries. Please check your database configuration.',
        );
        process.exit(1);
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
