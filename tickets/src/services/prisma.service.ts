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
    } catch {
      if (attempt < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
        this.logger.warn(
          `Failed to connect to the database. Retrying in ${delay / MILLISECONDS_IN_SECOND}s...`,
        );
        setTimeout(() => this.connectWithRetry(++attempt), delay);
      } else {
        process.exit(1);
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async clearDatabase() {
    const modelNames = Reflect.ownKeys(this)
      .filter((key) => typeof key === 'string')
      .filter(
        (key) => typeof this[key] === 'object' && 'deleteMany' in this[key],
      );

    const deleteOperations = modelNames.map((modelName) => {
      return this[modelName as string].deleteMany();
    });

    try {
      await this.$transaction(deleteOperations);
      this.logger.log('All models cleared.');
    } catch (error) {
      this.logger.error(
        'Failed to clear database automatically.',
        (error as Error).message,
      );
    }
  }
}
