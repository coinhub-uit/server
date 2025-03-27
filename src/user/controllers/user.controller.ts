import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UniversalJwtAuthGuard } from 'src/auth/guards/universal.jwt-auth.guard';
import { UserJwtAuthGuard } from 'src/auth/guards/user.jwt-auth.guard';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { UpdateParitialUserDto } from 'src/user/dtos/update-paritial-user.dto';
import { UpdateUserDto } from 'src/user/dtos/update-user.dto';
import { UserService } from 'src/user/services/user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Register profile',
    description:
      "Register a profile for exist user in supabase's auth database. (User only)",
  })
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    await this.userService.createUser(createUserDto);
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update information',
    description: "Update user's information, need to send all properties.",
  })
  @Put()
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    await this.userService.createUser(updateUserDto);
  }

  // TODO: WIP
  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update paritial information',
    description: "Update paritial user's information.",
  })
  @Patch()
  async updateParitialUser(
    @Body() updateParitialUserDto: UpdateParitialUserDto,
  ) {
    await this.userService.createUser(updateParitialUserDto);
  }

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }
}
