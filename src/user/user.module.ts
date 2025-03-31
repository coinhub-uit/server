import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { AuthModule } from 'src/auth/auth.module';
import { TicketService } from 'src/ticket/services/ticket.service';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TicketEntity]), AuthModule],
  controllers: [UserController],
  providers: [UserService, TicketService],
})
export class UserModule {}
