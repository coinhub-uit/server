import { Injectable, ForbiddenException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from 'src/auth/services/auth.service';
import { UserJwtRequest } from 'src/auth/types/user.jwt-request';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'user-jwt') {
  static extractJwt = ExtractJwt.fromAuthHeaderAsBearerToken();
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<UserJwtRequest> {
    let token: string | null;
    try {
      token = UserJwtStrategy.extractJwt(req);
    } catch {
      throw new ForbiddenException();
    }
    if (!token) {
      throw new ForbiddenException();
    }
    const userJwtRequest: UserJwtRequest | null =
      await this.authService.verifyUserToken(token);
    if (!userJwtRequest) {
      throw new ForbiddenException();
    }
    return userJwtRequest;
  }
}
