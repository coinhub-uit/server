import {
  Controller,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthGuard } from 'src/auth/guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from 'src/auth/guards/refresh-auth/refresh-auth.guard';

interface adminAuth extends Request {
  user: string;
}

// TODO: the token response is not match ...
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    description: 'Successfully refreshed the token',
    example: {
      username: 'GuessMe',
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    } satisfies ReturnType<AuthController['login']>,
  })
  @ApiUnauthorizedResponse({ description: 'Who the fuck are you?' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('admin/login')
  login(@Request() req: adminAuth) {
    return this.authService.login(req.user);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Successfully refreshed the token',
    example: {
      username: 'GuessMe',
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    } satisfies ReturnType<AuthController['refreshToken']>,
  })
  @ApiUnauthorizedResponse({ description: 'Who the fuck are you?' })
  @UseGuards(RefreshAuthGuard)
  @Post('admin/refresh')
  refreshToken(@Request() req: adminAuth) {
    return this.authService.refreshToken(req.user);
  }
}
