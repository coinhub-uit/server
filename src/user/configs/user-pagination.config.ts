import { PaginateConfig, PaginationType } from 'nestjs-paginate';
import { UserResponseDto } from 'src/user/dtos/user.response.dto';

export const userPaginationConfig: PaginateConfig<UserResponseDto> = {
  sortableColumns: ['createdAt'],
  paginationType: PaginationType.CURSOR,
};
