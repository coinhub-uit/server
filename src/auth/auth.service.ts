import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/admin/admin.service';
import refreshJwtConfig from 'src/config/refresh-jwt.config';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfiguration: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async validateAdmin(username: string, password: string) {
    const admin = await this.adminService.findOne(username);
    if (!admin) throw new UnauthorizedException('User not found');
    if (password === admin.password) {
      return admin.username;
    }
    throw new UnauthorizedException('Wrong password');
  }
  async login(username: string) {
    const [token, refreshToken] = await Promise.all([
      this.jwtService.sign({ sub: username }),
      this.jwtService.sign({ sub: username }, this.refreshTokenConfiguration),
    ]);
    return { username: username, token, refreshToken };
  }

  async refreshToken(adminId: string) {
    const [token] = await Promise.all([this.jwtService.sign({ sub: adminId })]);
    return { id: adminId, token };
  }
}
