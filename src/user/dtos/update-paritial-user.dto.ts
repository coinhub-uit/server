import { ApiSchema, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';

// TODO: We need the user ID
@ApiSchema({
  description: 'Update Partial User Request Schema',
})
export class UpdateParitialUserDto extends PartialType(CreateUserDto) {}
