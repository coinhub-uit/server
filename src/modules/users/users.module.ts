import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/modules/users/controllers/users.controller';
import { Method } from 'src/modules/users/entities/method.entity';
import { Notification } from 'src/modules/users/entities/notification.entity';
import { Rate } from 'src/modules/users/entities/rate.entity';
import { Ticket } from 'src/modules/users/entities/ticket.entity';
import { Transaction } from 'src/modules/users/entities/transaction.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/services/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Method,
      Ticket,
      User,
      Rate,
      Notification,
      Transaction,
    ]),
  ],
  controllers: [UserController],
  providers: [UsersService],
})
export class UsersModule {}
