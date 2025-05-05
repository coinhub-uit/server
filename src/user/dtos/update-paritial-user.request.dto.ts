import { ApiSchema, PartialType } from '@nestjs/swagger';
import { UpdateUserRequestDto } from 'src/user/dtos/update-user.request.dto';

@ApiSchema()
export class UpdateParitialUserRequestDto extends PartialType(
  UpdateUserRequestDto,
) {}
