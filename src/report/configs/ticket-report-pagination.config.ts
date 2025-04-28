import { PaginateConfig, PaginationType } from 'nestjs-paginate';
import { TicketReportEntity } from 'src/report/entities/ticket-report.entity';

export const ticketReportPaginationConfig: PaginateConfig<TicketReportEntity> =
  {
    sortableColumns: ['date'],
    paginationType: PaginationType.CURSOR,
  };
