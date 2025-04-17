import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/admin/entities/admin.entity';
import { AdminService } from './services/admin.service';
import { AdminController } from './controllers/admin.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    forwardRef(() => AuthModule),
  ],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [TypeOrmModule, AdminService],
})
export class AdminModule {}
