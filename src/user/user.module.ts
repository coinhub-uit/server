import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { DeviceEntity } from 'src/user/entities/device.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, DeviceEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
