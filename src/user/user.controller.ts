import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { UserService } from 'src/user/user.service';
import type { CreateUserParams } from 'src/user/utils/types';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    const user: CreateUserParams = {
      ...createUserDto,
      pin: createUserDto.pin.toString(),
    };
    return this.userService.createUser(user);
  }

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }
}
