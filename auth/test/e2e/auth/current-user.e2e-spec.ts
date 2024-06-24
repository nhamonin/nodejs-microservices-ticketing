import { HttpStatus } from '@nestjs/common';

import request from 'supertest';

import { app } from '../common/setup';
import { generateUser } from '../common/config';

describe('Current user', () => {
  it('responds with details about the current user', async () => {
    const user = generateUser();

    const authResponse = await request(app.getHttpServer())
      .post('/users/sign-up')
      .send(user.valid)
      .expect(HttpStatus.CREATED);
    const cookie = authResponse.get('Set-Cookie');

    const response = await request(app.getHttpServer())
      .get('/users/current')
      .set('Cookie', cookie)
      .expect(HttpStatus.OK);

    expect(response.body.currentUser.email).toEqual(user.valid.email);
  });
});
