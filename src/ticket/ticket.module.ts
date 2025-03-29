import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { TicketHistoryEntity } from 'src/ticket/entities/ticket-history.entity';
import { TicketController } from './controllers/ticket.controller';
import { TicketService } from './services/ticket.service';
import { SourceService } from 'src/source/services/source.service';
import { SourceEntity } from 'src/source/entities/source.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TicketEntity,
      TicketHistoryEntity,
      SourceEntity,
      UserEntity,
    ]),
  ],
  controllers: [TicketController],
  providers: [SourceService, TicketService],
})
export class TicketModule {}
