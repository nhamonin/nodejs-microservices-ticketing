import { HttpStatus } from '@nestjs/common';

import request from 'supertest';

import { app } from '../common/setup';
import { users } from './config';

describe('Signup Functionality', () => {
  it('should register a new user successfully', async () => {
    await request(app.getHttpServer())
      .post('/users/sign-up')
      .send(users.valid)
      .expect(HttpStatus.CREATED);
  });

  it('should return a 400 with an invalid email', async () => {
    await request(app.getHttpServer())
      .post('/users/sign-up')
      .send({
        email: users.invalid.email,
        password: users.valid.password,
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should return a 400 with an invalid password', async () => {
    await request(app.getHttpServer())
      .post('/users/sign-up')
      .send({
        email: users.valid.email,
        password: users.invalid.password,
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should return a 400 with missing email and password', async () => {
    await request(app.getHttpServer())
      .post('/users/sign-up')
      .send({
        email: users.valid.email,
      })
      .expect(HttpStatus.BAD_REQUEST);

    await request(app.getHttpServer())
      .post('/users/sign-up')
      .send({
        password: users.valid.password,
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('disallow duplicate email registration', async () => {
    await request(app.getHttpServer())
      .post('/users/sign-up')
      .send(users.valid)
      .expect(HttpStatus.CREATED);

    await request(app.getHttpServer())
      .post('/users/sign-up')
      .send(users.valid)
      .expect(HttpStatus.CONFLICT);
  });
});
