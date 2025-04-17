import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateAdminDto } from 'src/admin/dtos/create-admin.dto';
import { LoginAdminDto } from 'src/admin/dtos/login-admin.dto';
import { AdminEntity } from 'src/admin/entities/admin.entity';
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

  // TODO: Just for test, comment or guard this later
  @ApiOperation({
    summary: 'Create',
  })
  @ApiCreatedResponse()
  @Post()
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    await this.adminService.createAdmin(createAdminDto);
  }

  @ApiBearerAuth('admin')
  @ApiOperation({ summary: 'Get admins' })
  @ApiOkResponse({
    type: [AdminEntity],
  })
  @UseGuards(AdminJwtAuthGuard)
  @Get()
  async getAdmins() {
    return this.adminService.find();
  }

  @UseGuards(AdminLocalAuthGuard)
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginAdminDto }) // Explicitly declarethe request body
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @HttpCode(200)
  @Post('login')
  login(@Request() req: Request & { user: AdminLocalRequest }) {
    return this.authService.generateTokens(req.user.username);
  }

  @ApiBearerAuth('admin')
  @ApiOperation({ summary: 'Refresh token' })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(AdminJwtAuthGuard)
  @Get('refresh')
  refreshToken(@Request() req: Request & { user: AdminJwtRequest }) {
    return this.authService.generateTokens(req.user.username);
  }
}
