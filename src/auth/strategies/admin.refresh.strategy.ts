import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/auth/services/auth.service';
import refreshJwtConfig from 'src/config/admin.refresh-jwt.config';

export type AuthRefreshJwtPayload = {
  sub: number;
};

@Injectable()
export class AdminRefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'admin-refresh-jwt',
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
