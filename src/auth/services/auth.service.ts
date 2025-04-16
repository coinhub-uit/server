import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/admin/services/admin.service';
import { AdminJwtPayload } from 'src/auth/types/admin.jwt-payload';
import { AdminJwtRequest } from 'src/auth/types/admin.jwt-request';
import { UniversalJwtRequest } from 'src/auth/types/universal.jwt-request';
import { UserJwtPayload } from 'src/auth/types/user.jwt-payload';
import { UserJwtRequest } from 'src/auth/types/user.jwt-request';
import { verify } from 'lib/hashing';
import adminJwtConfig from 'src/config/admin.jwt.config';
import adminRefreshJwtConfig from 'src/config/admin.refresh-jwt.config';
import userJwtConfig from 'src/config/user.jwt.config';
import { UserService } from 'src/user/services/user.service';
import { SourceEntity } from 'src/source/entities/source.entity';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
    private userService: UserService,
    @Inject(adminRefreshJwtConfig.KEY)
    private _adminRefreshJwtConfig: ConfigType<typeof adminRefreshJwtConfig>,
    @Inject(adminJwtConfig.KEY)
    private _adminJwtConfig: ConfigType<typeof adminJwtConfig>,
    @Inject(userJwtConfig.KEY)
    private _userJwtConfig: ConfigType<typeof userJwtConfig>,
  ) {}

  async verifyUserToken(token: string): Promise<UserJwtRequest | null> {
    try {
      const payload: UserJwtPayload = this.jwtService.verify(
        token,
        this._userJwtConfig,
      );
      const { email, sub } = payload;
      const sourceIdList = (await this.userService.getSourcesByUserId(sub)).map(
        (source: SourceEntity) => source.id,
      );
      return { userId: sub, email, isAdmin: false, sourceIdList: sourceIdList };
    } catch {
      return null;
    }
  }

  async verifyUniversalToken(token: string): Promise<UniversalJwtRequest> {
    try {
      const payload: UserJwtPayload = this.jwtService.verify(
        token,
        this._userJwtConfig,
      );
      const sourceIdList = (
        await this.userService.getSourcesByUserId(payload.sub)
      ).map((source: SourceEntity) => source.id);
      const userJwtRequest: UserJwtRequest = {
        isAdmin: false,
        email: payload.email,
        userId: payload.sub,
        sourceIdList: sourceIdList,
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
      throw new NotFoundException('Admin not found');
    }
    if (await verify(password, admin.password)) {
      return admin.username;
    }
    throw new ForbiddenException('Wrong admin password');
  }

  generateTokens(username: string) {
    const accessToken = this.jwtService.sign(
      { sub: username, isAdmin: true } satisfies AdminJwtPayload,
      this._adminJwtConfig,
    );
    const refreshToken = this.jwtService.sign(
      { sub: username },
      this._adminRefreshJwtConfig,
    );
    return { accessToken, refreshToken };
  }
}
