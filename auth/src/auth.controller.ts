import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/current')
  async register() {
    return this.authService.register();
  }
}
