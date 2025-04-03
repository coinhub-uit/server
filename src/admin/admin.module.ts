import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/admin/entities/admin.entity';
import { AdminService } from './services/admin.service';
import { AdminController } from './controllers/admin.controller';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { UniversalJwtStrategy } from 'src/auth/strategies/universal.jwt.strategy';
import { AdminSubscriber } from 'src/admin/subscribers/admin.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    forwardRef(() => AuthModule),
  ],
  providers: [AdminService, AdminSubscriber, JwtService, UniversalJwtStrategy],
  controllers: [AdminController],
  exports: [AdminService, AdminSubscriber, TypeOrmModule],
})
export class AdminModule {}
