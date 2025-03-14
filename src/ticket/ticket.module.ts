import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { TicketPlanHistoryEntity } from 'src/ticket/entities/ticket_plan_history.entity';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';

@Module({
  imports: [TypeOrmModule.forFeature([TicketEntity, TicketPlanHistoryEntity])],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
