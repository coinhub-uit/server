import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { AdminService } from 'src/admin/services/admin.service';
import { CreateAdminDto } from 'src/admin/dtos/create-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiCreatedResponse({
    description: 'Successfully logged in',
  })
  @Post()
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
}
