import { HttpStatus } from '@nestjs/common';

import request from 'supertest';

import { app } from '../common/setup';
import { generateUser } from '../common/config';
import { signIn } from '../utils/sign-in';

describe('Current user', () => {
  it('responds with details about the current user', async () => {
    const user = generateUser();
    const cookie = await signIn(user.valid);

    const response = await request(app.getHttpServer())
      .get('/users/current')
      .set('Cookie', cookie)
      .expect(HttpStatus.OK);

    expect(response.body.currentUser.email).toEqual(user.valid.email);
  });

  it('responds with a 401 if the user is not logged in', async () => {
    const response = await request(app.getHttpServer())
      .get('/users/current')
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body.currentUser).toBeUndefined();
  });
});
