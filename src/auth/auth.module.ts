import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AdminLocalStrategy } from 'src/auth/strategies/admin.local.strategy';
import { AdminRefreshJwtStrategy } from 'src/auth/strategies/admin.refresh.strategy';
import adminJwtConfig from 'src/config/admin.jwt.config';
import adminRefreshJwtConfig from 'src/config/admin.refresh-jwt.config';
import userJwtConfig from 'src/config/user.jwt.config';
import { UserJwtStrategy } from 'src/auth/strategies/user.jwt.strategy';
import { UniversalJwtStrategy } from 'src/auth/strategies/universal.jwt.strategy';
import { AdminJwtStrategy } from 'src/auth/strategies/admin.jwt.stategy';
import { AdminModule } from 'src/admin/admin.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    forwardRef(() => AdminModule),
    ConfigModule.forFeature(adminJwtConfig),
    ConfigModule.forFeature(adminRefreshJwtConfig),
    ConfigModule.forFeature(userJwtConfig),
    UserModule,
  ],
  providers: [
    AuthService,
    JwtService,
    UserJwtStrategy,
    AdminLocalStrategy,
    AdminJwtStrategy,
    AdminRefreshJwtStrategy,
    UniversalJwtStrategy,
  ],
  controllers: [],
  exports: [AuthService, JwtService],
})
export class AuthModule {}
