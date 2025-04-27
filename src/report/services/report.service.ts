import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityReportEntity } from 'src/report/entities/activity-report.entity';
import { RevenueReportEntity } from 'src/report/entities/revenue-report.entity';
import { TicketReportEntity } from 'src/report/entities/ticket-report.entity';
import { Repository } from 'typeorm';

// TODO: Paginate all
@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(ActivityReportEntity)
    private readonly activityReportRepository: Repository<ActivityReportEntity>,
    @InjectRepository(RevenueReportEntity)
    private readonly revenueReportRepository: Repository<RevenueReportEntity>,
    @InjectRepository(TicketReportEntity)
    private readonly ticketReportRepository: Repository<TicketReportEntity>,
  ) {}

  async findActivityReports() {
    return await this.activityReportRepository.find();
  }

  async findRevenueReports() {
    return await this.revenueReportRepository.find();
  }

  async findTicketReports() {
    return await this.ticketReportRepository.find();
  }
}
