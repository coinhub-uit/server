import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { activityReportPaginationConfig } from 'src/report/configs/activity-report-pagination.config';
import { revenueReportPaginationConfig } from 'src/report/configs/revenue-report-pagination.config';
import { ticketReportPaginationConfig } from 'src/report/configs/ticket-report-pagination.config';
import { ActivityReportEntity } from 'src/report/entities/activity-report.entity';
import { RevenueReportEntity } from 'src/report/entities/revenue-report.entity';
import { TicketReportEntity } from 'src/report/entities/ticket-report.entity';
import { Repository } from 'typeorm';

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

  async findActivityReports(query: PaginateQuery) {
    return await paginate(
      query,
      this.activityReportRepository,
      activityReportPaginationConfig,
    );
  }

  async findRevenueReports(query: PaginateQuery) {
    return await paginate(
      query,
      this.revenueReportRepository,
      revenueReportPaginationConfig,
    );
  }

  async findTicketReports(query: PaginateQuery) {
    return await paginate(
      query,
      this.ticketReportRepository,
      ticketReportPaginationConfig,
    );
  }
}
