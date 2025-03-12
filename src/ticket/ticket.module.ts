import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { TicketInterestRateEntity } from 'src/ticket/ticket_interest_rate/entities/ticket_interest_rate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketEntity, TicketInterestRateEntity])],
})
export class TicketModule {}
