import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/auth/services/auth.service';

export type UserJwtPayload = {
  sub: string;
} & Record<string, string>;

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'user-jwt') {
  constructor(private authService: AuthService) {
    super();
  }

  validate(token: string) {
    return this.authService.verifyUserToken(token);
  }
}
