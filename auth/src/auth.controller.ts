import { All, Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { NotFoundError } from './common/errors/NotFound';

@ApiTags('users')
@Controller('users')
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
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request. The request body does not contain the required fields, or validation failed.',
  })
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @All('*')
  notFound() {
    throw new NotFoundError('Route');
  }
}
