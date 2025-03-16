import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/user/auth/services/auth.service';
import jwtSupabaseConfig from 'src/config/jwt-supabase.config';

export type AuthJwtPayload = {
  sub: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'user-jwt') {
  constructor(
    @Inject(jwtSupabaseConfig.KEY)
    jwtConfiguration: ConfigType<typeof jwtSupabaseConfig>,
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
