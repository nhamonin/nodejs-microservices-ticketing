import request from 'supertest';

import { app } from '../common/setup';

const testUser = {
  email: 'testuser@example.com',
  password: 'strongPassword123!',
};

describe('Signup Functionality', () => {
  it('should register a new user successfully', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/sign-up')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(201);

    expect(response.body.email).toEqual(testUser.email);
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).toHaveProperty('id');
    expect(typeof response.body.id).toBe('string');
  });
});
