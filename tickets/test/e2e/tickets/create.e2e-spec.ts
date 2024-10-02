import { HttpStatus } from '@nestjs/common';
import request from 'supertest';

import { app } from '../common/setup';
import { signIn } from '../utils/signIn';

const cookie = signIn();

describe('Create Ticket', () => {
  it('has a route handler listening on POST /api/tickets', async () => {
    const response = await request(app.getHttpServer()).post('/api/tickets').send({
      title: 'Test',
      price: '100',
    });

    expect([HttpStatus.NOT_FOUND, HttpStatus.INTERNAL_SERVER_ERROR]).not.toContain(response.status);
  });

  it('can only be accessed by authenticated users', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/tickets')
      .send({
        title: 'Test',
        price: '100',
      });

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('returns a status other than 401 if the user is authenticated', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'Test',
        price: '100',
      });

    expect(response.status).not.toBe(HttpStatus.UNAUTHORIZED);
  });

  it('returns an error if invalid title is provided', async () => {
    let response = await request(app.getHttpServer())
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: '',
        price: '100',
      });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);

    response = await request(app.getHttpServer())
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 213,
        price: '100',
        userId: '123e4567-e89b-12d3-a456-426614174000'
      });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('returns an error if invalid price is provided', async () => {
    const response1 = await request(app.getHttpServer())
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'Test',
        price: '',
        userId: '123e4567-e89b-12d3-a456-426614174000',
      });

    expect(response1.status).toBe(HttpStatus.BAD_REQUEST);

    const response2 = await request(app.getHttpServer())
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'Test',
        price: '-100',
      });

    expect(response2.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('creates a new ticket with valid input', async () => {
    const server = app.getHttpServer();

  let response = await request(server).get('/api/tickets').send();

  expect(response.status).toBe(HttpStatus.OK);
  expect(response.body.length).toBe(0);

  response = await request(server)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Test',
      price: '100',
    });

  expect(response.status).toBe(HttpStatus.CREATED);

  response = await request(server).get('/api/tickets').send();

  expect(response.status).toBe(HttpStatus.OK);
  expect(response.body.length).toBe(1);
  expect(response.body[0].title).toBe('Test');
  expect(response.body[0].price).toBe('100');
  expect(response.body[0].userId).toBe('123e4567-e89b-12d3-a456-426614174000');
  });
});
