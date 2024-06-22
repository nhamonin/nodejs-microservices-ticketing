import request from 'supertest';

import { app } from './common/setup';

describe('AppController (e2e)', () => {
  it('returns 201 on successful signup', () => {
    return request(app.getHttpServer())
      .post('/users/sign-up')
      .send({
        email: 'testemail.@test.com',
        password: 'password1',
      })
      .expect(201);
  });
});
