import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateAdminDto } from 'src/admin/dtos/create-admin.dto';
import { LoginAdminDto } from 'src/admin/dtos/login-admin.dto';
import { AdminService } from 'src/admin/services/admin.service';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin.jwt-auth.guard';
import { AdminLocalAuthGuard } from 'src/auth/guards/admin.local-auth.guard';
import { AuthService } from 'src/auth/services/auth.service';
import { AdminJwtRequest } from 'src/auth/types/admin.jwt-request';
import { AdminLocalRequest } from 'src/auth/types/admin.local-request';

@Controller('admins')
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

  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
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

  @ApiBody({ type: LoginAdminDto }) // Explicitly declare the request body
  @ApiOkResponse({
    description: 'Login the admin',
    example: {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc0MjgzMDI3NywiZXhwIjoxNzQyODMzODc3fQ.Uqnp518LNF6ZRVmrIy97c165XPAo5-s44UV0cTlS6f4',
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc0MjgzMDI3NywiZXhwIjoxNzQzNDM1MDc3fQ.KdWa6w76vn1GTz0sPM8bCzmoneJxEBsRMtdP5WlfdnE',
    } satisfies Awaited<ReturnType<AdminController['login']>>,
  })
  @ApiUnauthorizedResponse({ description: 'Who the fuck are you?' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminLocalAuthGuard)
  @Post('login')
  login(@Request() req: Request & { user: AdminLocalRequest }) {
    return this.authService.loginAdmin(req.user.username);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Successfully refreshed the token',
    example: {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc0MjgzMDI3NywiZXhwIjoxNzQyODMzODc3fQ.Uqnp518LNF6ZRVmrIy97c165XPAo5-s44UV0cTlS6f4',
    } satisfies Awaited<ReturnType<AdminController['refreshToken']>>,
  })
  @UseGuards(AdminJwtAuthGuard)
  @ApiUnauthorizedResponse({ description: 'Who the fuck are you?' })
  @Post('refresh')
  refreshToken(@Request() req: Request & { user: AdminJwtRequest }) {
    return this.authService.refreshTokenAdmin(req.user.username);
  }
}
