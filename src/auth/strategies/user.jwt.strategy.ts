import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  validate(req: Request): UserJwtRequest {
    let token: string | null;
    try {
      token = UserJwtStrategy.extractJwt(req);
    } catch {
      throw new UnauthorizedException();
    }
    if (!token) {
      throw new UnauthorizedException();
    }
    const userJwtRequest: UserJwtRequest | null =
      this.authService.verifyUserToken(token);
    if (!userJwtRequest) {
      throw new UnauthorizedException();
    }
    return userJwtRequest;
  }
}
