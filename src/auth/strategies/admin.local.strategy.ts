import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/auth/services/auth.service';

@Injectable()
export class AdminLocalStrategy extends PassportStrategy(
  Strategy,
  'admin-local',
) {
  constructor(private authService: AuthService) {
    super();
  }

  validate(username: string, password: string) {
    return this.authService.validateAdmin(username, password);
  }
}
