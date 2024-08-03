import {
  All,
  Body,
  Controller,
  Get,
  Post,
  HttpStatus,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SignUpDto } from './dto/sign-up.dto';
import { NotFoundError } from './common/errors/NotFoundError';
import { SignInDto } from './dto/sign-in.dto';
import { AUTH_COOKIE_NAME } from './constants';

@ApiTags('users')
@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/current')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the current logged-in user details.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized if the user is not logged in or token is invalid.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description:
      'Internal server error. Something went wrong on the server side.',
  })
  async getCurrentUser(@Req() request: Request) {
    return this.authService.getCurrentUser(request.currentUser);
  }

  @Post('/sign-in')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User signed in successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Bad Request. The request body does not contain the required fields, or validation failed.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized. Invalid credentials.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description:
      'Internal server error. Something went wrong on the server side.',
  })
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, accessToken, expiresIn } =
      await this.authService.signIn(signInDto);

    response.status(HttpStatus.OK).cookie(AUTH_COOKIE_NAME, accessToken, {
      maxAge: expiresIn,
      secure: process.env.NODE_ENV !== 'test',
      path: '/',
      sameSite: 'strict',
    });

    return user;
  }

  @Post('/sign-out')
  @ApiResponse({
    status: HttpStatus.OK,
    description: `Successfully signed out and cleared ${AUTH_COOKIE_NAME} cookie.`,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description:
      'Internal server error. Something went wrong on the server side.',
  })
  async signOut(@Res({ passthrough: true }) response: Response) {
    response.status(HttpStatus.OK).clearCookie(AUTH_COOKIE_NAME);

    return { message: 'Successfully signed out.' };
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
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description:
      'Internal server error. Something went wrong on the server side.',
  })
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, accessToken, expiresIn } =
      await this.authService.signUp(signUpDto);

    response.cookie(AUTH_COOKIE_NAME, accessToken, {
      maxAge: expiresIn,
      secure: process.env.NODE_ENV !== 'test',
      path: '/',
      sameSite: 'strict',
    });

    return user;
  }

  @All('*')
  @ApiExcludeEndpoint()
  notFound() {
    throw new NotFoundError('Route');
  }
}
