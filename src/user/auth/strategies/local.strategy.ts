import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/user/auth/services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'user-local') {
  constructor(private authService: AuthService) {
    super();
  }

  validate(usernameOrEmail: string, password: string) {
    return this.authService.validateUser(usernameOrEmail, password);
  }
}
