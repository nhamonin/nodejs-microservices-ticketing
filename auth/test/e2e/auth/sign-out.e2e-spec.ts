import { HttpStatus } from '@nestjs/common';

import request from 'supertest';
import { AUTH_COOKIE_NAME } from '@nh_tickets/common';

import { app } from '../common/setup';
import { generateUser } from '../common/config';

describe('Sign out', () => {
  it('clears the cookie after signing out', async () => {
    const user = generateUser();

    await request(app.getHttpServer())
      .post('/api/users/sign-up')
      .send(user.valid)
      .expect(HttpStatus.CREATED);

    const response = await request(app.getHttpServer())
      .post('/api/users/sign-in')
      .send(user.valid)
      .expect(HttpStatus.OK);

    expect(response.get('Set-Cookie')).toBeDefined();

    const signOutResponse = await request(app.getHttpServer())
      .post('/api/users/sign-out')
      .expect(HttpStatus.OK);

    expect(signOutResponse.get('Set-Cookie')[0]).toEqual(
      `${AUTH_COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    );
  });
});
