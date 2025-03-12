import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { AdminService } from 'src/admin/admin.service';
import { CreateAdminDto } from 'src/admin/dtos/create-admin.dto';
import { CreateAdminParams } from 'src/admin/utils/types';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // TODO: Guard this!
  @ApiCreatedResponse({
    description: 'Successfully created admin',
  })
  @Post()
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    const admin: CreateAdminParams = { ...createAdminDto };
    await this.adminService.createAdmin(admin);
  }

  // TODO: Guard this
  // TODO: Change the password to hashed
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
}
