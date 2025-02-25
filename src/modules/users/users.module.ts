import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/modules/users/controllers/users.controller';
import { Method } from 'src/modules/users/entities/method.entity';
import { Ticket } from 'src/modules/users/entities/ticket.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Ticket, Method])],
  controllers: [UserController],
  providers: [UsersService],
})
export class UsersModule {}
