import { faker } from '@faker-js/faker';

export function generateEmail() {
  return faker.internet.email();
}

export function generatePassword() {
  const password = faker.internet.password({
    length: 8,
    memorable: true,
    pattern: /\w/,
    prefix: 'A1@',
  });

  return password;
}
