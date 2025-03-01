import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/mobile/auth/services/auth.service';
import { LocalAuthGuard } from 'src/mobile/guard/local-auth.guard';

@Controller('user')
export class UserController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  //TODO: Handle type
  async login() {
    //   return this.authService.login();
  }
}
