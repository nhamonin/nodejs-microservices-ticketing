import { HttpStatus } from '@nestjs/common';

import request from 'supertest';

import { app } from '../common/setup';

type User = {
  email: string;
  password: string;
};

export async function signIn(user: User) {
  const response = await request(app.getHttpServer())
    .post('/users/sign-up')
    .send(user)
    .expect(HttpStatus.CREATED);

  return response.get('Set-Cookie');
}
