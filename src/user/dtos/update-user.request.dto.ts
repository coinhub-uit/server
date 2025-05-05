import { ApiSchema, OmitType } from '@nestjs/swagger';
import { CreateUserRequestDto } from 'src/user/dtos/create-user.request.dto';

@ApiSchema()
export class UpdateUserRequestDto extends OmitType(CreateUserRequestDto, [
  'id',
] as const) {}
