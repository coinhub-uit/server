import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/admin/entities/admin.entity';
import { AdminService } from './services/admin.service';
import { AdminController } from './controllers/admin.controller';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { UniversalJwtStrategy } from 'src/auth/strategies/universal.jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    forwardRef(() => AuthModule),
  ],
  providers: [AdminService, JwtService, UniversalJwtStrategy],
  controllers: [AdminController],
  exports: [AdminService, TypeOrmModule],
})
export class AdminModule {}
