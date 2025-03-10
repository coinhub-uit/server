import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class AuthService {
  constructor(private adminService: AdminService) {}

  async validateAdmin(username: string, password: string) {
    const admin = await this.adminService.findOne(username);
    if (!admin) throw new UnauthorizedException('User not found');
    if (password === admin.password) {
      return admin;
    }
    throw new UnauthorizedException('Wrong password');
  }
}
