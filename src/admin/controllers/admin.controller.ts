import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { AdminService } from 'src/admin/services/admin.service';
import { CreateAdminDto } from 'src/admin/dtos/create-admin.dto';
import { HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AdminLocalAuthGuard } from 'src/auth/guards/admin.local-auth.guard';
import { AuthService } from 'src/auth/services/auth.service';

interface adminAuth extends Request {
  user: string;
}

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
  ) {}

  // TODO: Just for test, comment this later
  @ApiCreatedResponse({
    description: 'Successfully logged in',
  })
  @Post('create')
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    await this.adminService.createAdmin(createAdminDto);
  }

  // TODO: Guard this
  @Get()
  @ApiOkResponse({
    description: "Get admins' information",
    example: [
      { username: 'GuessMe', password: 'StealMe!!' },
      { username: 'foo', password: 'bar' },
    ] satisfies Awaited<ReturnType<AdminController['getAdmins']>>,
  })
  async getAdmins() {
    return this.adminService.find();
  }

  @ApiOkResponse({
    description: 'Successfully refreshed the token',
    example: {
      username: 'GuessMe',
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    } satisfies Awaited<ReturnType<AdminController['login']>>,
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
    } satisfies Awaited<ReturnType<AdminController['refreshToken']>>,
  })
  @ApiUnauthorizedResponse({ description: 'Who the fuck are you?' })
  @Post('refresh')
  refreshToken(@Request() req: adminAuth) {
    return this.authService.refreshTokenAdmin(req.user);
  }
}
