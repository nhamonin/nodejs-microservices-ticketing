import { HttpStatus } from '@nestjs/common';
import request from 'supertest';

import { app } from '../common/setup';
import { signIn } from '../utils/signIn';

const cookie = signIn();

describe('Read Tickets', () => {
  it('fetches a list of tickets', async () => {
    const server = app.getHttpServer();

    await request(server)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'Test Ticket 1',
        price: '100',
      });

    await request(server)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'Test Ticket 2',
        price: '200',
      });

    const response = await request(server).get('/api/tickets').send();

    expect(response.status).toBe(HttpStatus.OK);

    expect(response.body.length).toBe(2);

    const titles = response.body.map((ticket: any) => ticket.title);
    const prices = response.body.map((ticket: any) => ticket.price);

    expect(titles).toEqual(expect.arrayContaining(['Test Ticket 1', 'Test Ticket 2']));
    expect(prices).toEqual(expect.arrayContaining(['100', '200']));
  });

  it('returns a 404 if the ticket is not found', async () => {
    const server = app.getHttpServer();

    const response = await request(server).get('/api/tickets/123').send();

    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('fetches a specific ticket by id', async () => {
    const server = app.getHttpServer();

    const createResponse = await request(server)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'Test Ticket',
        price: '100',
      });

    expect(createResponse.status).toBe(HttpStatus.CREATED);

    const ticketId = createResponse.body.id;

    const response = await request(server).get(`/api/tickets/${ticketId}`).send();

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.title).toBe('Test Ticket');
    expect(response.body.price).toBe('100');
    expect(response.body.id).toBe(ticketId);
  });
});
