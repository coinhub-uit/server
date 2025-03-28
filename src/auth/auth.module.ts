import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AdminService } from 'src/admin/services/admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/admin/entities/admin.entity';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    ConfigModule.forFeature(adminJwtConfig),
    ConfigModule.forFeature(adminRefreshJwtConfig),
    ConfigModule.forFeature(userJwtConfig),
  ],
  providers: [
    AuthService,
    AdminService,
    JwtService,
    UserJwtStrategy,
    UniversalJwtStrategy,
    AdminLocalStrategy,
    AdminJwtStrategy,
    AdminRefreshJwtStrategy,
  ],
  controllers: [],
})
export class AuthModule {}
