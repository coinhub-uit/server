import { ApiSchema, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';

@ApiSchema()
export class UpdateUserDto extends OmitType(CreateUserDto, ['id'] as const) {}
