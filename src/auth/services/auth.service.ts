import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/admin/services/admin.service';
import { AdminJwtPayload } from 'src/auth/strategies/admin.jwt.stategy';
import { UserJwtPayload } from 'src/auth/strategies/user.jwt.strategy';
import { verify } from 'src/common/utils/hashing';
import adminJwtConfig from 'src/config/admin.jwt.config';
import adminRefreshJwtConfig from 'src/config/admin.refresh-jwt.config';
import userJwtConfig from 'src/config/user.jwt.config';

type UserTokenPayload = {
  sub: string;
  email: string;
};

// type UniversalPayload = UserTokenPayload | AdminJwtPayload;

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

  verifyUserToken(token: string) {
    try {
      const payload: UserTokenPayload = this.jwtService.verify(
        token,
        this._userJwtConfig,
      );
      const { email, sub, ..._ } = payload; // eslint-disable-line @typescript-eslint/no-unused-vars
      return { email, sub };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  // verifyUniversalToken(token: string) {
  //   let signOptions: JwtSignOptions;
  //   const payload: UniversalPayload = this.jwtService.decode(token);
  //   if (payload['isAdmin']) {
  //     signOptions = this._adminJwtConfig;
  //   } else {
  //     signOptions = this._userJwtConfig;
  //   }
  //   try {
  //     const payload: UniversalPayload = this.jwtService.verify(
  //       token,
  //       signOptions,
  //     );
  //     console.log(payload);
  //     return payload;
  //   } catch (error) {
  //     throw new UnauthorizedException(error);
  //   }
  // }

  verifyUniversalToken(token: string) {
    try {
      const payload: UserJwtPayload = this.jwtService.verify(
        token,
        this._userJwtConfig,
      );
      return payload;
    } catch {
      try {
        const payload: AdminJwtPayload = this.jwtService.verify(
          token,
          this._adminJwtConfig,
        );
        return payload;
      } catch {
        throw new UnauthorizedException('No permission to access');
      }
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
