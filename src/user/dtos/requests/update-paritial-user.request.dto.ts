import { ApiSchema, PartialType } from '@nestjs/swagger';
import { CreateUserRequestDto } from 'src/user/dtos/requests/create-user.request.dto';

@ApiSchema()
export class UpdateParitialUserRequestDto extends PartialType(
  CreateUserRequestDto,
) {}
