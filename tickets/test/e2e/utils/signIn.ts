import jwt from 'jsonwebtoken';

export function signIn(payload = { id: '123e4567-e89b-12d3-a456-426614174000', email: 'test@test.com' }) {
  const token = jwt.sign(payload, process.env.JWT_SECRET);

  return `Authorization=${token}`;
}
