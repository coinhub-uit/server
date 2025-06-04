import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { DeviceEntity } from 'src/user/entities/device.entity';
import { SourceModule } from 'src/source/source.module';
import { TicketModule } from 'src/ticket/ticket.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, DeviceEntity]),
    forwardRef(() => SourceModule),
    forwardRef(() => TicketModule),
    forwardRef(() => NotificationModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
