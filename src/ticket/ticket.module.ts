import { Module } from '@nestjs/common';
import { TicketInterestRateModule } from './ticket_interest_rate/ticket_interest_rate.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';

@Module({
  imports: [TicketInterestRateModule, TypeOrmModule.forFeature([TicketEntity])],
})
export class TicketModule {}
