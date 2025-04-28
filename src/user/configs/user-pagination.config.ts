import { PaginateConfig, PaginationType } from 'nestjs-paginate';
import { UserEntity } from 'src/user/entities/user.entity';

export const userPaginationConfig: PaginateConfig<UserEntity> = {
  sortableColumns: ['id', 'fullname'],
  paginationType: PaginationType.CURSOR,
};
