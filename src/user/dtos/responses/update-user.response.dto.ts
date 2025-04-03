import { ApiSchema } from '@nestjs/swagger';
import { CreateUserResponseDto } from 'src/user/dtos/responses/create-user.response.dto';

@ApiSchema()
export class UpdateUserResponseDto extends CreateUserResponseDto {}
