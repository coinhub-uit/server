import { Controller } from '@nestjs/common';
import { UsersService } from 'src/modules/users/services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}
}
