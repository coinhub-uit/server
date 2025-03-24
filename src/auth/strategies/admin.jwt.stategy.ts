import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/auth/services/auth.service';
import adminJwtConfig from 'src/config/admin.jwt.config';

export type AuthJwtPayload = {
  sub: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(
    @Inject(adminJwtConfig.KEY)
    jwtConfiguration: ConfigType<typeof adminJwtConfig>,
    private AuthService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfiguration.secret as string,
      ignoreExpiration: false,
    });
  }
  validate(payload: AuthJwtPayload) {
    return { id: payload.sub };
  }
}
