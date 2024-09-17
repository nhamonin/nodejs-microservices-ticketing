import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtAuthGuard as BaseJwtAuthGuard } from '@nh_tickets/common';

@Injectable()
export class JwtAuthGuard extends BaseJwtAuthGuard {
  constructor(jwtService: JwtService) {
    super(jwtService);
  }
}
