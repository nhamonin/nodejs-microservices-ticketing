import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import ms from 'ms';
import { ConflictError, UnauthorizedError } from '@nh_tickets/common';

import { SignUpDto } from './dto/sign-up.dto';
import { PrismaService } from './services/prisma.service';
import { SignInDto } from './dto/sign-in.dto';
import { JwtPayload } from './dto/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getCurrentUser(user: { email: string; id: string }) {
    return { currentUser: user || null };
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const payload: JwtPayload = { username: user.email, id: user.id };
    const accessToken = await this.jwtService.signAsync(payload);
    const expiresIn = this.configService.get<string>('JWT_EXPIRATION');

    return {
      user: { email: user.email, id: user.id },
      accessToken,
      expiresIn: ms(expiresIn),
    };
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

    const payload: JwtPayload = { username: user.email, id: user.id };
    const accessToken = this.jwtService.sign(payload);
    const expiresIn = this.configService.get<string>('JWT_EXPIRATION');

    return {
      user: { email: user.email, id: user.id },
      accessToken,
      expiresIn: ms(expiresIn),
    };
  }
}
