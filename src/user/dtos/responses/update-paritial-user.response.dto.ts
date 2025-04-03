import { PartialType } from '@nestjs/swagger';
import { CreateUserResponseDto } from 'src/user/dtos/responses/create-user.response.dto';

export class UpdateParitialUserResponseDto extends PartialType(
  CreateUserResponseDto,
) {}
