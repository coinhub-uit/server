import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { TicketPlanHistoryEntity } from 'src/ticket/entities/ticket_plan_history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketEntity, TicketPlanHistoryEntity])],
})
export class TicketModule {}
