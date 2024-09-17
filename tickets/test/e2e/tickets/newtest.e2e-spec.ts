import { HttpStatus } from '@nestjs/common';
import request from 'supertest';

import { app } from '../common/setup';

it('has a route handler listening on POST /api/tickets', async () => {
  const response = await request(app.getHttpServer()).post('/api/tickets').send({
    title: 'Test',
    price: '100',
  });

  expect([HttpStatus.NOT_FOUND, HttpStatus.INTERNAL_SERVER_ERROR]).not.toContain(response.status);
});

it('can only be accessed by authenticated users', async () => {
  const response = await request(app.getHttpServer()).post('/api/tickets').send({
    title: 'Test',
    price: '100',
  });

  expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
});

it('returns an error if invalid title is provided', async () => {});

it('returns an error if invalid price is provided', async () => {});

it('creates a new ticket with valid input', async () => {});
