import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from 'src/mobile/auth/strategies/jwt.strategy';
import { UserModule } from 'src/mobile/user/user.module';
import { LocalStrategy } from 'src/mobile/auth/strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_LOCAL_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [JwtStrategy, AuthService],
})
export class AuthModule {}
