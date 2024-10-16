import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import amqplib, { Connection } from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: Connection;
  private readonly logger = new Logger(RabbitMQService.name);

  constructor(
    private readonly configService: ConfigService
  ) {}

  async onModuleInit() {
    await this.connectWithRetry();
  }

  async connectWithRetry(attempt: number = 0) {
    const MAX_RETRIES = 7;
    const MILLISECONDS_IN_SECOND = 1000;
    const INITIAL_RETRY_DELAY = 1 * MILLISECONDS_IN_SECOND;
    const amqpUrl = this.configService.get<string>('AMQP_URL');

    try {
      this.connection = await amqplib.connect(amqpUrl);
      this.logger.log('Connected to RabbitMQ');

      this.connection.on('close', () => {
        this.logger.error('RabbitMQ connection closed');
        this.handleConnectionLoss();
      });

      this.connection.on('error', (error) => {
        this.logger.error('RabbitMQ connection error', error);
        this.handleConnectionLoss();
      });

    } catch (error) {
      if (attempt < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
        this.logger.warn(
          `Failed to connect to RabbitMQ. Retrying in ${delay / MILLISECONDS_IN_SECOND}s...`
        );
        setTimeout(() => this.connectWithRetry(++attempt), delay);
      } else {
        this.logger.error('Failed to connect to RabbitMQ after maximum retries', error);
        this.handleConnectionLoss();
      }
    }
  }

  private handleConnectionLoss() {
    this.closeConnection();

    process.exit(1);
  }

  async onModuleDestroy() {
    this.closeConnection();
  }

  private closeConnection() {
    if (this.connection) {
      this.connection.close();
      this.logger.log('RabbitMQ connection closed');
    }
  }

  getConnection(): Connection {
    return this.connection;
  }
}