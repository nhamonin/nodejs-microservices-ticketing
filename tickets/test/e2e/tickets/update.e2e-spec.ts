import { HttpStatus } from '@nestjs/common';
import request from 'supertest';

import { app } from '../common/setup';
import { signIn } from '../utils/signIn';

const cookie = signIn();
const anotherUserCookie = signIn({ id: 'another-user-id', email: 'another@test.com' });

describe('Update Ticket', () => {
  it('updates a ticket', async () => {
    const server = app.getHttpServer();

    const createResponse = await request(server)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'Initial Title',
        price: '100',
        userId: '123e4567-e89b-12d3-a456-426614174000',
      });

    expect(createResponse.status).toBe(HttpStatus.CREATED);

    const ticketId = createResponse.body.id;

    const updateResponse = await request(server)
      .patch(`/api/tickets/${ticketId}`)
      .set('Cookie', cookie)
      .send({
        title: 'Updated Title',
        price: '150',
      });

    expect(updateResponse.status).toBe(HttpStatus.OK);
    expect(updateResponse.body.title).toBe('Updated Title');
    expect(updateResponse.body.price).toBe('150');
  });

  it('returns a 404 if the ticket is not found', async () => {
    const server = app.getHttpServer();

    const response = await request(server)
      .patch('/api/tickets/non-existing-id')
      .set('Cookie', cookie)
      .send({
        title: 'Updated Title',
        price: '150',
      });

    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('returns a 400 if invalid input is provided', async () => {
    const server = app.getHttpServer();

    const createResponse = await request(server)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'Initial Title',
        price: '100',
        userId: '123e4567-e89b-12d3-a456-426614174000',
      });

    expect(createResponse.status).toBe(HttpStatus.CREATED);

    const ticketId = createResponse.body.id;

    const response = await request(server)
      .patch(`/api/tickets/${ticketId}`)
      .set('Cookie', cookie)
      .send({
        title: '',
        price: '-100',
      });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('returns a 401 if the user is not authenticated', async () => {
    const server = app.getHttpServer();

    const createResponse = await request(server)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'Initial Title',
        price: '100',
        userId: '123e4567-e89b-12d3-a456-426614174000',
      });

    expect(createResponse.status).toBe(HttpStatus.CREATED);

    const ticketId = createResponse.body.id;

    const response = await request(server)
      .patch(`/api/tickets/${ticketId}`)
      .send({
        title: 'Updated Title',
        price: '150',
      });

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('returns a 403 if the user is not the creator of the ticket', async () => {
    const server = app.getHttpServer();

    const createResponse = await request(server)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'Initial Title',
        price: '100',
        userId: '123e4567-e89b-12d3-a456-426614174000',
      });

    expect(createResponse.status).toBe(HttpStatus.CREATED);

    const ticketId = createResponse.body.id;

    const response = await request(server)
      .patch(`/api/tickets/${ticketId}`)
      .set('Cookie', anotherUserCookie)
      .send({
        title: 'Updated Title',
        price: '150',
      });

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  it('returns a 400 if invalid title or price is provided', async () => {
    const server = app.getHttpServer();

    const createResponse = await request(server)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'Initial Title',
        price: '100',
        userId: '123e4567-e89b-12d3-a456-426614174000',
      });

    expect(createResponse.status).toBe(HttpStatus.CREATED);

    const ticketId = createResponse.body.id;

    let response = await request(server)
      .patch(`/api/tickets/${ticketId}`)
      .set('Cookie', cookie)
      .send({
        title: '',
        price: '150',
      });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);

    response = await request(server)
      .patch(`/api/tickets/${ticketId}`)
      .set('Cookie', cookie)
      .send({
        title: 'Updated Title',
        price: '-100',
      });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });
});
