import { PaginateConfig, PaginationType } from 'nestjs-paginate';
import { ActivityReportEntity } from 'src/report/entities/activity-report.entity';

export const activityReportPaginationConfig: PaginateConfig<ActivityReportEntity> =
  {
    sortableColumns: ['date', 'tickets', 'users'],
    filterableColumns: {
      date: true,
      tickets: true,
      totalPrincipal: true,
      users: true,
    },
    paginationType: PaginationType.LIMIT_AND_OFFSET,
  };
