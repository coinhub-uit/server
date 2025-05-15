import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin.jwt-auth.guard';
import { activityReportPaginationConfig } from 'src/report/configs/activity-report-pagination.config';
import { revenueReportPaginationConfig } from 'src/report/configs/revenue-report-pagination.config';
import { ticketReportPaginationConfig } from 'src/report/configs/ticket-report-pagination.config';
import { ActivityReportEntity } from 'src/report/entities/activity-report.entity';
import { RevenueReportEntity } from 'src/report/entities/revenue-report.entity';
import { TicketReportEntity } from 'src/report/entities/ticket-report.entity';
import { ReportService } from 'src/report/services/report.service';

@Controller('reports')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth('admin')
  @PaginatedSwaggerDocs(ActivityReportEntity, activityReportPaginationConfig)
  @Get('activity')
  async getActivityReport(@Paginate() query: PaginateQuery) {
    return await this.reportService.findActivityReports(query);
  }

  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth('admin')
  @PaginatedSwaggerDocs(RevenueReportEntity, revenueReportPaginationConfig)
  @Get('revenue')
  async getRevenueReport(@Paginate() query: PaginateQuery) {
    return await this.reportService.findRevenueReports(query);
  }

  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth('admin')
  @PaginatedSwaggerDocs(TicketReportEntity, ticketReportPaginationConfig)
  @Get('ticket')
  async getTicketReport(@Paginate() query: PaginateQuery) {
    return await this.reportService.findTicketReports(query);
  }
}
