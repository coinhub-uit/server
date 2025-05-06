import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin.jwt-auth.guard';
import { activityReportPaginationConfig } from 'src/report/configs/activity-report-pagination.config';
import { revenueReportPaginationConfig } from 'src/report/configs/revenue-report-pagination.config';
import { ticketReportPaginationConfig } from 'src/report/configs/ticket-report-pagination.config';
import { ActivityReportResponseDto } from 'src/report/dtos/activity-report.response.dto';
import { RevenueReportResponseDto } from 'src/report/dtos/revenue-report.response.dto';
import { TicketReportResponseDto } from 'src/report/dtos/ticket-report.response.dto';
import { ReportService } from 'src/report/services/report.service';

@Controller('reports')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth('admin')
  @PaginatedSwaggerDocs(
    ActivityReportResponseDto,
    activityReportPaginationConfig,
  )
  @Get('activity')
  async getActivityReport(@Paginate() query: PaginateQuery) {
    return await this.reportService.findActivityReports(query);
  }

  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth('admin')
  @PaginatedSwaggerDocs(RevenueReportResponseDto, revenueReportPaginationConfig)
  @Get('revenue')
  async getRevenueReport(@Paginate() query: PaginateQuery) {
    return await this.reportService.findRevenueReports(query);
  }

  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth('admin')
  @PaginatedSwaggerDocs(TicketReportResponseDto, ticketReportPaginationConfig)
  @Get('ticket')
  async getTicketReport(@Paginate() query: PaginateQuery) {
    return await this.reportService.findTicketReports(query);
  }
}
