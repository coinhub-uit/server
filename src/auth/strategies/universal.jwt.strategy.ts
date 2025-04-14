import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from 'src/auth/services/auth.service';
import { UniversalJwtRequest } from 'src/auth/types/universal.jwt-request';

@Injectable()
export class UniversalJwtStrategy extends PassportStrategy(
  Strategy,
  'universal-jwt',
) {
  static jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<UniversalJwtRequest> {
    const token: string | null = UniversalJwtStrategy.jwtFromRequest(req);
    if (!token) {
      throw new ForbiddenException('Missing Token');
    }
    return await this.authService.verifyUniversalToken(token);
  }
}
