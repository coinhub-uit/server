import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/admin/services/admin.service';
import { AdminJwtPayload } from 'src/auth/types/admin.jwt-payload';
import { AdminJwtRequest } from 'src/auth/types/admin.jwt-request';
import { UniversalJwtRequest } from 'src/auth/types/universal.jwt-request';
import { UserJwtPayload } from 'src/auth/types/user.jwt-payload';
import { UserJwtRequest } from 'src/auth/types/user.jwt-request';
import { verify } from 'src/common/utils/hashing';
import adminJwtConfig from 'src/config/admin.jwt.config';
import adminRefreshJwtConfig from 'src/config/admin.refresh-jwt.config';
import userJwtConfig from 'src/config/user.jwt.config';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
    @Inject(adminRefreshJwtConfig.KEY)
    private _adminRefreshJwtConfig: ConfigType<typeof adminRefreshJwtConfig>,
    @Inject(adminJwtConfig.KEY)
    private _adminJwtConfig: ConfigType<typeof adminJwtConfig>,
    @Inject(userJwtConfig.KEY)
    private _userJwtConfig: ConfigType<typeof userJwtConfig>,
  ) {}

  verifyUserToken(token: string): UserJwtRequest | null {
    try {
      const payload: UserJwtPayload = this.jwtService.verify(
        token,
        this._userJwtConfig,
      );
      const { email, sub } = payload;
      return { userId: sub, email, isAdmin: false };
    } catch {
      return null;
    }
  }

  verifyUniversalToken(token: string): UniversalJwtRequest {
    try {
      const payload: UserJwtPayload = this.jwtService.verify(
        token,
        this._userJwtConfig,
      );
      const userJwtRequest: UserJwtRequest = {
        isAdmin: false,
        email: payload.email,
        userId: payload.sub,
      };
      return userJwtRequest;
    } catch {
      const payload: AdminJwtPayload = this.jwtService.verify(
        token,
        this._adminJwtConfig,
      );
      const adminJwtRequest: AdminJwtRequest = {
        isAdmin: true,
        username: payload.sub,
      };
      return adminJwtRequest;
    }
  }

  async validateAdmin(username: string, password: string) {
    const admin = await this.adminService.findOne(username);
    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }
    if (await verify(password, admin.password)) {
      return admin.username;
    }
    throw new UnauthorizedException('Wrong admin password');
  }

  loginAdmin(username: string) {
    const token = this.jwtService.sign(
      { sub: username, isAdmin: true } satisfies AdminJwtPayload,
      this._adminJwtConfig,
    );
    const refreshToken = this.jwtService.sign(
      { sub: username },
      this._adminRefreshJwtConfig,
    );
    return { username, token, refreshToken };
  }

  refreshTokenAdmin(username: string) {
    const token = this.jwtService.sign(
      { sub: username, isAdmin: true } satisfies AdminJwtPayload,
      this._adminJwtConfig,
    );
    return { username, token };
  }
}
