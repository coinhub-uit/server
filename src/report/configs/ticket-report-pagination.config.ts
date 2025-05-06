import { PaginateConfig, PaginationType } from 'nestjs-paginate';
import { TicketReportEntity } from 'src/report/entities/ticket-report.entity';

export const ticketReportPaginationConfig: PaginateConfig<TicketReportEntity> =
  {
    sortableColumns: ['date', 'days', 'openedCount', 'closedCount'],
    filterableColumns: {
      date: true,
      days: true,
      openedCount: true,
      closedCount: true,
    },
    paginationType: PaginationType.LIMIT_AND_OFFSET,
  };
