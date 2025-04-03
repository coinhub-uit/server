import { ApiSchema } from '@nestjs/swagger';
import { CreateUserRequestDto } from 'src/user/dtos/requests/create-user.request.dto';

@ApiSchema()
export class UpdateUserRequestDto extends CreateUserRequestDto {}
