import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LocalAuthGuard } from 'src/user/auth/guard/local-auth/local-auth.guard';
import { AuthService } from 'src/user/auth/services/auth.service';

interface userAuth extends Request {
  user: {
    userNameOrEmail: string;
    userId: string;
  };
}

@Controller('user/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: userAuth) {
    return this.authService.login(req.user.userNameOrEmail, req.user.userId);
  }
}
