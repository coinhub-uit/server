import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin.jwt-auth.guard';
import { UniversalJwtAuthGuard } from 'src/auth/guards/universal.jwt-auth.guard';
import { UserJwtAuthGuard } from 'src/auth/guards/user.jwt-auth.guard';
import { UniversalJwtRequest } from 'src/auth/types/universal.jwt-request';
import { UserJwtRequest } from 'src/auth/types/user.jwt-request';
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
  async createUser(
    @Req() req: Request & { user: UserJwtRequest },
    @Body() createUserDto: CreateUserDto,
  ) {
    if (req.user.userId !== createUserDto.id) {
      throw new UnauthorizedException(
        'You are only allowed to create your own profile',
      );
    }
    await this.userService.createUser(createUserDto);
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update information',
    description: "Update user's information, need to send all properties.",
  })
  @Put()
  async updateUser(
    @Req() req: Request & { user: UniversalJwtRequest },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (!req.user.isAdmin && req.user.userId !== updateUserDto.id) {
      throw new UnauthorizedException(
        'You are only allowed to update your own profile',
      );
    }
    await this.userService.updateUser(updateUserDto);
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update paritial information',
    description:
      "Update paritial user's information. User ID is required for admin request.",
  })
  @Patch()
  async updateParitialUser(
    @Req() req: Request & { user: UniversalJwtRequest },
    @Body() updateParitialUserDto: UpdateParitialUserDto,
  ) {
    if (
      !req.user.isAdmin &&
      updateParitialUserDto.id !== undefined &&
      req.user.userId !== updateParitialUserDto.id
    ) {
      throw new UnauthorizedException(
        'You are only allowed to update your own profile',
      );
    }
    await this.userService.updatePartialUser(updateParitialUserDto);
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete user',
    description: 'Delete user with user id',
  })
  @Delete(':id')
  async deleteUserById(
    @Req() req: Request & { user: UniversalJwtRequest },
    @Param('id') id: string,
  ) {
    // HACK: This delete is not clean. It doesn't delete the user in supabase auth.
    if (!req.user.isAdmin && req.user.userId !== id) {
      throw new UnauthorizedException(
        'You are only allowed to delete your own profile',
      );
    }
    await this.userService.deleteUserById(id);
  }

  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get users',
    description: 'Get all users',
  })
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user infomation',
    description: 'Get user information by ID',
  })
  @Get(':id')
  async getUserById(
    @Req() req: Request & { user: UniversalJwtRequest },
    @Param('id') id: string,
  ) {
    if (!req.user.isAdmin && req.user.userId !== id) {
      throw new UnauthorizedException(
        'You are only allowed to get your own profile information',
      );
    }
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
