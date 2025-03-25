import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { TicketPlanHistoryEntity } from 'src/ticket/entities/ticket-plan-history.entity';
import { TicketController } from './controllers/ticket.controller';
import { TicketService } from './services/ticket.service';

@Module({
  imports: [TypeOrmModule.forFeature([TicketEntity, TicketPlanHistoryEntity])],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
