import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/admin/services/admin.service';
import { verify } from 'src/common/utils/hashing';
import adminJwtConfig from 'src/config/admin.jwt.config';
import adminRefreshJwtConfig from 'src/config/admin.refresh-jwt.config';
import userJwtConfig from 'src/config/user.jwt.config';

type UserTokenPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
    @Inject(adminRefreshJwtConfig.KEY)
    private adminRefreshJwtConfig_: ConfigType<typeof adminRefreshJwtConfig>,
    @Inject(adminJwtConfig.KEY)
    private adminJwtConfig_: ConfigType<typeof adminJwtConfig>,
    @Inject(userJwtConfig.KEY)
    private userJwtConfig_: ConfigType<typeof userJwtConfig>,
  ) {}

  // TODO: Maybe? check for admin / user -> Guard for both of them
  verifyUserToken(token: string) {
    try {
      const payload: UserTokenPayload = this.jwtService.verify(
        token,
        this.userJwtConfig_,
      );
      const { email, sub, ..._ } = payload; // eslint-disable-line @typescript-eslint/no-unused-vars
      return { email, sub };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async validateAdmin(username: string, password: string) {
    console.log(`${username} ${password}`);
    const admin = await this.adminService.findOne(username);
    if (!admin) {
      throw new UnauthorizedException('User not found');
    }
    if (await verify(password, admin.password)) {
      return admin.username;
    }
    throw new UnauthorizedException('Wrong password');
  }

  loginAdmin(username: string) {
    const token = this.jwtService.sign({ sub: username }, this.adminJwtConfig_);
    const refreshToken = this.jwtService.sign(
      { sub: username },
      this.adminRefreshJwtConfig_,
    );
    return { username, token, refreshToken };
  }

  refreshTokenAdmin(username: string) {
    const token = this.jwtService.sign({ sub: username }, this.adminJwtConfig_);
    return { username, token };
  }
}
