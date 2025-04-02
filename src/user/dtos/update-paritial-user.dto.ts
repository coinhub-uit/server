import { ApiSchema, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';

@ApiSchema()
export class UpdateParitialUserDto extends PartialType(CreateUserDto) {}
