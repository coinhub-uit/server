import { PaginateConfig, PaginationType } from 'nestjs-paginate';
import { RevenueReportEntity } from 'src/report/entities/revenue-report.entity';

export const revenueReportPaginationConfig: PaginateConfig<RevenueReportEntity> =
  {
    sortableColumns: ['date', 'days'],
    filterableColumns: { date: true, days: true },
    paginationType: PaginationType.LIMIT_AND_OFFSET,
  };
