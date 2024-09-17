import { HttpStatus } from '@nestjs/common';

import request from 'supertest';

import { app } from '../common/setup';
import { generateUser } from '../common/config';

describe('Sign up', () => {
  it('should register a new user successfully', async () => {
    await request(app.getHttpServer())
      .post('/api/users/sign-up')
      .send(generateUser().valid)
      .expect(HttpStatus.CREATED);
  });

  it('should return a 400 with an invalid email', async () => {
    await request(app.getHttpServer())
      .post('/api/users/sign-up')
      .send({
        email: generateUser().invalid.email,
        password: generateUser().valid.password,
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should return a 400 with an invalid password', async () => {
    await request(app.getHttpServer())
      .post('/api/users/sign-up')
      .send({
        email: generateUser().valid.email,
        password: generateUser().invalid.password,
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should return a 400 with missing email and password', async () => {
    await request(app.getHttpServer())
      .post('/api/users/sign-up')
      .send({
        email: generateUser().valid.email,
      })
      .expect(HttpStatus.BAD_REQUEST);

    await request(app.getHttpServer())
      .post('/api/users/sign-up')
      .send({
        password: generateUser().valid.password,
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('disallow duplicate email registration', async () => {
    const user = generateUser();

    await request(app.getHttpServer())
      .post('/api/users/sign-up')
      .send(user.valid)
      .expect(HttpStatus.CREATED);

    await request(app.getHttpServer())
      .post('/api/users/sign-up')
      .send(user.valid)
      .expect(HttpStatus.CONFLICT);
  });

  it('sets a cookie after successful registration', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/users/sign-up')
      .send(generateUser().valid)
      .expect(HttpStatus.CREATED);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
