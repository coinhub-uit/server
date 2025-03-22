import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/admin/services/admin.service';
import refreshJwtConfig from 'src/config/admin-refresh-jwt.config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfiguration: ConfigType<typeof refreshJwtConfig>,
  ) {}

  // TODO: Maybe? check for admin / user -> Guard for both of them

  async validateAdmin(username: string, password: string) {
    const admin = await this.adminService.findOne(username);
    if (!admin) throw new UnauthorizedException('User not found');
    if (await bcrypt.compare(password, admin.password)) {
      return admin.username;
    }
    throw new UnauthorizedException('Wrong password');
  }

  loginAdmin(username: string) {
    const token = this.jwtService.sign({ sub: username });
    const refreshToken = this.jwtService.sign(
      { sub: username },
      this.refreshTokenConfiguration,
    );
    return { username, token, refreshToken };
  }

  refreshTokenAdmin(username: string) {
    const [token] = this.jwtService.sign({ sub: username });
    return { username: username, token };
  }
}
