import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from 'src/auth/services/auth.service';

@Injectable()
export class UniversalJwtStrategy extends PassportStrategy(
  Strategy,
  'universal-jwt',
) {
  static jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

  constructor(private authService: AuthService) {
    super();
  }

  validate(req: Request) {
    const token: string | null = UniversalJwtStrategy.jwtFromRequest(req);
    if (!token) {
      throw new UnauthorizedException();
    }
    return this.authService.verifyUniversalToken(token);
  }
}
