import {
  Controller,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Post,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthGuard } from 'src/auth/guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from 'src/auth/guards/refresh-auth/refresh-auth.guard';
interface adminAuth extends Request {
  user: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('admin/login')
  async login(@Request() req: adminAuth) {
    console.log(req);
    return this.authService.login(req.user);
  }

  @UseGuards(RefreshAuthGuard)
  @Post('admin/refresh')
  async refreshToken(@Request() req: adminAuth) {
    return this.authService.refreshToken(req.user);
  }
}
