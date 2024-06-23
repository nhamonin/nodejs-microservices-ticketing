import { generateEmail, generatePassword } from '../utils/generateData';

export const users = {
  valid: {
    email: generateEmail(),
    password: generatePassword(),
  },
  invalid: {
    email: 'invalidemail',
    password: 'stro',
  },
};
