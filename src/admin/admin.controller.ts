import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { CreateAdminDto } from 'src/admin/dtos/create-admin.dto';
import { CreateAdminParams } from 'src/admin/utils/types';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    const admin: CreateAdminParams = { ...createAdminDto };
    return this.adminService.createAdmin(admin);
  }

  @Get()
  async getAdmins() {
    return this.adminService.find();
  }
}
