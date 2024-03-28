import { Injectable } from '@nestjs/common';

import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  getCurrentUser() {
    return 'Hi there!';
  }

  signIn() {
    return 'You are signed in!';
  }

  signOut() {
    return 'You are signed out!';
  }

  signUp(signUpDto: SignUpDto) {
    return `You are signed up! Your email is ${signUpDto.email}.`;
  }
}
