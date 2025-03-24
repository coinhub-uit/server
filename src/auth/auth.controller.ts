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
import { AdminLocalAuthGuard } from 'src/auth/guards/admin.local-auth.guard';
import { AuthService } from 'src/auth/services/auth.service';

interface adminAuth extends Request {
  user: string;
}

// TODO: the token response is not match ...
@Controller('admin/auth')
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
    } satisfies Awaited<ReturnType<AuthController['login']>>,
  })
  @ApiUnauthorizedResponse({ description: 'Who the fuck are you?' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminLocalAuthGuard)
  @Post('login')
  login(@Request() req: adminAuth) {
    return this.authService.loginAdmin(req.user);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Successfully refreshed the token',
    example: {
      username: 'GuessMe',
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    } satisfies Awaited<ReturnType<AuthController['refreshToken']>>,
  })
  @ApiUnauthorizedResponse({ description: 'Who the fuck are you?' })
  @UseGuards(AdminLocalAuthGuard)
  @Post('refresh')
  refreshToken(@Request() req: adminAuth) {
    return this.authService.refreshTokenAdmin(req.user);
  }
}
