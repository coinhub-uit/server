import { PaginateConfig, PaginationType } from 'nestjs-paginate';
import { RevenueReportEntity } from 'src/report/entities/revenue-report.entity';

export const revenueReportPaginationConfig: PaginateConfig<RevenueReportEntity> =
  {
    sortableColumns: ['date'],
    paginationType: PaginationType.CURSOR,
  };
