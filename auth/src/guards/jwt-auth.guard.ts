import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

import { UnauthorizedError } from 'src/common/errors/UnauthorizedError';
import { AUTH_COOKIE_NAME } from '../constants';

declare module 'express' {
  interface Request {
    currentUser: {
      email: string;
      id: string;
    };
  }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies[AUTH_COOKIE_NAME];

    if (!token) {
      throw new UnauthorizedError();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.currentUser = {
        email: payload.username,
        id: payload.id,
      };

      return true;
    } catch {
      throw new UnauthorizedError();
    }
  }
}
