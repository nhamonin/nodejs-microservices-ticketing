import { Connection, Channel } from 'amqplib';

const mockChannel = {
  assertExchange: jest.fn().mockResolvedValue(undefined),
  publish: jest.fn().mockReturnValue(true),
} as Partial<Channel>;

const mockConnection = {
  createChannel: jest.fn().mockResolvedValue(mockChannel),
} as Partial<Connection>;

export const MockRabbitMQService = {
  getConnection: jest.fn().mockReturnValue(mockConnection),
};
