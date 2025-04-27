import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin.jwt-auth.guard';
import { ActivityReportEntity } from 'src/report/entities/activity-report.entity';
import { RevenueReportEntity } from 'src/report/entities/revenue-report.entity';
import { TicketReportEntity } from 'src/report/entities/ticket-report.entity';
import { ReportService } from 'src/report/services/report.service';

@Controller('reports')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiOkResponse({
    type: [TicketReportEntity],
  })
  @Get('ticket')
  async getTicketReport() {
    return await this.reportService.findTicketReports();
  }

  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiOkResponse({
    type: [ActivityReportEntity],
  })
  @Get('activity')
  async getActivityReport() {
    return await this.reportService.findActivityReports();
  }

  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiOkResponse({
    type: [RevenueReportEntity],
  })
  @Get('revenue')
  async getRevenueReport() {
    return await this.reportService.findRevenueReports();
  }
}
