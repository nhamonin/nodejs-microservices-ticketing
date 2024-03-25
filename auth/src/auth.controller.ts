import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { SignUpDto } from './sign-up.dto';

@ApiTags('users')
@Controller('api/users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/current')
  async getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  @Post('/sign-in')
  async signIn() {
    return this.authService.signIn();
  }

  @Post('/sign-out')
  async signOut() {
    return this.authService.signOut();
  }

  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
}
