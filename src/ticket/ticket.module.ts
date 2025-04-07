import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { TicketHistoryEntity } from 'src/ticket/entities/ticket-history.entity';
import { TicketController } from './controllers/ticket.controller';
import { TicketService } from './services/ticket.service';
import { UserModule } from 'src/user/user.module';
import { SourceModule } from 'src/source/source.module';
import { MethodModule } from 'src/method/method.module';
import { PlanModule } from 'src/plan/plan.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TicketEntity, TicketHistoryEntity]),
    UserModule,
    SourceModule,
    MethodModule,
    PlanModule,
  ],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TicketService, TypeOrmModule],
})
export class TicketModule {}
