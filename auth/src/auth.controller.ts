import { All, Body, Controller, Get, Post, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiExcludeEndpoint } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { NotFoundError } from './common/errors/NotFoundError';

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
    status: HttpStatus.CREATED,
    description: 'User created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Bad Request. The request body does not contain the required fields, or validation failed.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict. A user with the provided email already exists.',
  })
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @All('*')
  @ApiExcludeEndpoint()
  notFound() {
    throw new NotFoundError('Route');
  }
}
