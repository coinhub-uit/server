import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportController } from 'src/report/controllers/report.controller';
import { ActivityReportEntity } from 'src/report/entities/activity-report.entity';
import { RevenueReportEntity } from 'src/report/entities/revenue-report.entity';
import { TicketReportEntity } from 'src/report/entities/ticket-report.entity';
import { ReportService } from 'src/report/services/report.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ActivityReportEntity,
      RevenueReportEntity,
      TicketReportEntity,
    ]),
  ],
  providers: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}
