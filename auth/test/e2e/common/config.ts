import { generateEmail, generatePassword } from '../utils/generateData';

export function generateUser() {
  return {
    valid: {
      email: generateEmail(),
      password: generatePassword(),
    },
    invalid: {
      email: 'invalidemail',
      password: 'stro',
    },
  };
}
