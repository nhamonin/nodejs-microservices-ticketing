import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { SignUpDto } from './dto/sign-up.dto';
import { PrismaService } from './services/prisma.service';
import { CustomError } from './common/errors/CustomError';
import { ConflictError } from './common/errors/ConflictError';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(AuthService.name);

  async getCurrentUser() {
    try {
      return await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
        },
      });
    } catch (error) {
      this.logger.error('Failed to get current user', error);
      throw new CustomError('Failed to get current user');
    }
  }

  signIn() {
    return 'You are signed in!';
  }

  signOut() {
    return 'You are signed out!';
  }

  async signUp(signUpDto: SignUpDto) {
    const { email, password } = signUpDto;

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new ConflictError('User already exists');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
        },
      });

      return user;
    } catch (error) {
      this.logger.error('Failed to create user', error.stack);
      throw new CustomError('Failed to create user');
    }
  }
}
