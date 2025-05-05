import { PaginateConfig, PaginationType } from 'nestjs-paginate';
import { ActivityReportEntity } from 'src/report/entities/activity-report.entity';

export const activityReportPaginationConfig: PaginateConfig<ActivityReportEntity> =
  {
    sortableColumns: ['date'],
    paginationType: PaginationType.LIMIT_AND_OFFSET,
  };
