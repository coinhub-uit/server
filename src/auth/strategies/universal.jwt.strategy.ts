import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import adminJwtConfig from 'src/config/admin.jwt.config';
import { ConfigType } from '@nestjs/config';
import { ExtractJwt } from 'passport-jwt';
import userJwtConfig from 'src/config/user.jwt.config';
import { AdminJwtPayload } from 'src/auth/strategies/admin.jwt.stategy';
import { UserJwtPayload } from 'src/auth/strategies/user.jwt.strategy';

type UniversalPayLoad = AdminJwtPayload | UserJwtPayload;

@Injectable()
export class UniversalJwtStrategy extends PassportStrategy(
  Strategy,
  'universal-jwt',
) {
  constructor(
    @Inject(adminJwtConfig.KEY)
    adminJwtConfiguration: ConfigType<typeof adminJwtConfig>,
    @Inject(userJwtConfig.KEY)
    userJwtConfiguration: ConfigType<typeof userJwtConfig>,
  ) {
    try {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: adminJwtConfiguration.secret as string,
        ignoreExpiration: false,
      });
    } catch {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: userJwtConfiguration.secret as string,
        ignoreExpiration: false,
      });
    }
  }

  validate(payload: UniversalPayLoad) {
    return payload;
  }
}
