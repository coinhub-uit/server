import { ApiSchema, PartialType } from '@nestjs/swagger';
import { UpdateUserDto } from 'src/user/dtos/update-user.dto';

@ApiSchema()
export class UpdateParitialUserDto extends PartialType(UpdateUserDto) {}
