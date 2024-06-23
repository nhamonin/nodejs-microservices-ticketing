import { HttpStatus } from '@nestjs/common';

import request from 'supertest';

import { app } from '../common/setup';
import { generateUser } from '../common/config';

describe('Sign in', () => {
  it('fails when a email that does not exist is supplied', async () => {
    await request(app.getHttpServer())
      .post('/users/sign-in')
      .send(generateUser().valid)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('fails when an incorrect password is supplied', async () => {
    const user = generateUser();

    await request(app.getHttpServer())
      .post('/users/sign-up')
      .send(user.valid)
      .expect(HttpStatus.CREATED);

    await request(app.getHttpServer())
      .post('/users/sign-in')
      .send({
        email: user.valid.email,
        password: user.invalid.password,
      })
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('succeeds when a valid email and password are supplied', async () => {
    const user = generateUser();

    await request(app.getHttpServer())
      .post('/users/sign-up')
      .send(user.valid)
      .expect(HttpStatus.CREATED);

    await request(app.getHttpServer())
      .post('/users/sign-in')
      .send(user.valid)
      .expect(HttpStatus.OK);
  });

  it('responds with a cookie when a valid email and password are supplied', async () => {
    const user = generateUser();

    await request(app.getHttpServer())
      .post('/users/sign-up')
      .send(user.valid)
      .expect(HttpStatus.CREATED);

    const response = await request(app.getHttpServer())
      .post('/users/sign-in')
      .send(user.valid)
      .expect(HttpStatus.OK);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
