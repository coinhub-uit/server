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
  ForbiddenException,
  UseGuards,
  ConflictException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin.jwt-auth.guard';
import { UniversalJwtAuthGuard } from 'src/auth/guards/universal.jwt-auth.guard';
import { UserJwtAuthGuard } from 'src/auth/guards/user.jwt-auth.guard';
import { UniversalJwtRequest } from 'src/auth/types/universal.jwt-request';
import { UserJwtRequest } from 'src/auth/types/user.jwt-request';
import { SourceEntity } from 'src/source/entities/source.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { UpdateParitialUserDto } from 'src/user/dtos/update-paritial-user.dto';
import { UpdateUserDto } from 'src/user/dtos/update-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiOperation({
    summary: 'Get all profiles',
    description: "Get all users' profile",
  })
  @ApiOkResponse({
    description: 'Successful',
    type: [UserEntity],
  })
  @Get()
  async getAll() {
    return await this.userService.getAll();
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('universal')
  @ApiOperation({
    summary: 'Get infomation',
    description: 'Get user profile by ID',
  })
  @ApiForbiddenResponse({
    description: 'Not allowed',
    example: new ForbiddenException(
      'You are only allowed to get your own profile',
    ),
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    example: new NotFoundException('User not found'),
  })
  @ApiOkResponse({
    description: 'Successful',
    type: UserEntity,
  })
  @Get(':id')
  async getById(
    @Req() req: Request & { user: UniversalJwtRequest },
    @Param('id') id: string,
  ) {
    if (!req.user.isAdmin && req.user.userId !== id) {
      throw new ForbiddenException(
        'You are only allowed to get your own profile',
      );
    }
    const user = await this.userService.getById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Register profile',
    description:
      "Register a profile for existed user in Supabase's auth database. (User only)",
  })
  @ApiForbiddenResponse({
    description: 'Conflict',
    example: new ConflictException(
      'User profile is already existed, cannot create a new one',
    ),
  })
  @ApiCreatedResponse({
    description: 'User profile created successfully',
    type: UserEntity,
  })
  @Post()
  async create(
    @Req() req: Request & { user: UserJwtRequest },
    @Body() createUserDto: CreateUserDto,
  ) {
    const user = await this.userService.getById(req.user.userId);
    if (user) {
      throw new ConflictException(
        'User profile is already existed, cannot create a new one',
      );
    }
    return await this.userService.createUser(createUserDto, req.user.userId);
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('universal')
  @ApiOperation({
    summary: 'Update profile',
    description: "Update user's profile, need to send all properties.",
  })
  @ApiForbiddenResponse({
    description: 'Not allowed',
    example: new ForbiddenException(
      "You are not allowed to update other user's profile",
    ),
  })
  @ApiNotFoundResponse({
    description: "User doesn't exist to be updated",
    example: new NotFoundException("User doesn't exist to be updated"),
  })
  @ApiNoContentResponse({
    description: 'User profile updated successfully',
  })
  @Put(':id')
  async update(
    @Req() req: Request & { user: UniversalJwtRequest },
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (!req.user.isAdmin && req.user.userId !== userId) {
      throw new ForbiddenException(
        "You are not allowed to update other user's profile",
      );
    }
    const user = await this.userService.getById(userId);
    if (!user) {
      throw new NotFoundException("User doesn't exist to be updated");
    }
    await this.userService.update(updateUserDto, userId);
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('universal')
  @ApiOperation({
    summary: 'Update paritial profile',
    description:
      "Update paritial user's profile. User ID is required for admin request",
  })
  @ApiForbiddenResponse({
    description: 'Not allowed',
    example: new ForbiddenException(
      "You are not allowed to paritially update other user's profile",
    ),
  })
  @ApiNotFoundResponse({
    description: "User doesn't exist to be updated",
    example: new NotFoundException("User doesn't exist to be updated"),
  })
  @ApiOkResponse({
    description: 'User profile updated successfully',
    type: UserEntity,
  })
  @Patch(':id')
  async updateParitial(
    @Req() req: Request & { user: UniversalJwtRequest },
    @Param('id') userId: string,
    @Body() updateParitialUserDto: UpdateParitialUserDto,
  ) {
    if (!req.user.isAdmin && req.user.userId !== userId) {
      throw new ForbiddenException(
        "You are not allowed to paritially update other user's profile",
      );
    }
    const user = await this.userService.getById(userId);
    if (!user) {
      throw new NotFoundException(
        "User doesn't exist to be paritially updated",
      );
    }
    return await this.userService.partialUpdate(updateParitialUserDto, userId);
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('universal')
  @ApiOperation({
    summary: 'Delete user',
    description: 'Delete user with user id',
  })
  @ApiForbiddenResponse({
    description: 'Not allowed',
    example: new ForbiddenException(
      "You are not allowed to delete other user's profile",
    ),
  })
  @ApiNotFoundResponse({
    description: "User doesn't exist to be deleted",
    example: new NotFoundException("User doesn't exist to be deleted"),
  })
  @ApiNoContentResponse({
    description: 'User deleted successfully',
  })
  @Delete(':id')
  async delete(
    @Req() req: Request & { user: UniversalJwtRequest },
    @Param('id') userId: string,
  ) {
    // HACK: This delete is not clean. It doesn't delete the user in supabase auth.
    if (!req.user.isAdmin && req.user.userId !== userId) {
      throw new ForbiddenException(
        "You are not allowed to delete other user's profile",
      );
    }
    const user = await this.userService.getById(userId);
    if (!user) {
      throw new NotFoundException("User doesn't exist to be deleted");
    }
    await this.userService.deleteById(userId);
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('universal')
  @ApiOperation({
    summary: 'Get sources of user',
    description: 'Get all sources of user with user id',
  })
  @ApiForbiddenResponse({
    description: 'Not allowed',
    example: new ForbiddenException(
      "You are not allowed to get other user's sources",
    ),
  })
  @ApiOkResponse({
    description: 'Successful',
    type: [SourceEntity],
  })
  @Get(':id/sources')
  async getSources(
    @Req() req: Request & { user: UniversalJwtRequest },
    @Param('id') userId: string,
  ) {
    if (!req.user.isAdmin && req.user.userId !== userId) {
      throw new ForbiddenException(
        "You are not allowed to get other user's sources",
      );
    }
    return await this.userService.getSources(userId);
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('universal')
  @ApiOperation({
    summary: 'Get tickets of user',
    description: 'Get all tickets of user with user id',
  })
  @ApiForbiddenResponse({
    description: 'Not allowed',
    example: new ForbiddenException(
      "You are not allowed to get other user's sources",
    ),
  })
  @ApiOkResponse({
    description: 'Successful',
    type: [TicketEntity],
  })
  @Get(':id/tickets')
  async getTickets(
    @Req() req: Request & { user: UniversalJwtRequest },
    @Param('id') userId: string,
  ) {
    if (!req.user.isAdmin && req.user.userId !== userId) {
      throw new ForbiddenException(
        "You are not allowed to get other user's tickets",
      );
    }
    return await this.userService.getTickets(userId);
  }
}
