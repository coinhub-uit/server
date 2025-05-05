import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SourceEntity } from 'src/source/entities/source.entity';
import { SourceService } from './services/source.service';
import { SourceController } from './controllers/source.controller';
import { TicketModule } from 'src/ticket/ticket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SourceEntity]),
    forwardRef(() => TicketModule),
  ],
  providers: [SourceService],
  controllers: [SourceController],
  exports: [SourceService, TypeOrmModule],
})
export class SourceModule {}
