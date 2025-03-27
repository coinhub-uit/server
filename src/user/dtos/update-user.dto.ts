import { ApiSchema } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';

@ApiSchema({
  description: 'Update User Request Schema',
})
export class UpdateUserDto extends CreateUserDto {}
