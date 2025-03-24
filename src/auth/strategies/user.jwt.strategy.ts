import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/auth/services/auth.service';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'user-jwt') {
  constructor(private authService: AuthService) {
    super();
  }

  validate(token: string) {
    return this.authService.verifyUserToken(token);
  }
}
