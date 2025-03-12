import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/auth/auth.service';
import refreshJwtConfig from 'src/config/refresh-jwt.config';

export type AuthRefreshJwtPayload = {
  sub: number;
};

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(refreshJwtConfig.KEY)
    jwtRefreshConfiguration: ConfigType<typeof refreshJwtConfig>,
    private AuthService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtRefreshConfiguration.secret as string,
      ignoreExpiration: false,
    });
  }
  validate(payload: AuthRefreshJwtPayload) {
    return { id: payload.sub };
  }
}
