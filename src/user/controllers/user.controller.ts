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
  ApiConflictResponse,
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
import { UserAlreadyExistException } from 'src/user/exceptions/user-already-exist.exception';
import { UserNotExistException } from 'src/user/exceptions/user-not-exist.exception';
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

  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @ApiOperation({
    summary: 'Register profile',
    description:
      "Register a profile for existed user in Supabase's auth database. (User only)",
  })
  @ApiConflictResponse({
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
    try {
      return await this.userService.createUser(createUserDto, req.user.userId);
    } catch (error) {
      if (error instanceof UserAlreadyExistException) {
        throw new ConflictException(
          'User profile is already existed, cannot create a new one',
        );
      }
      throw error;
    }
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Get profile',
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
    try {
      const user = await this.userService.getByIdOrFail(id);
      return user;
    } catch (error) {
      if (error instanceof UserNotExistException) {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
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
    try {
      await this.userService.update(updateUserDto, userId);
    } catch (error) {
      if (error instanceof UserNotExistException) {
        throw new NotFoundException("User doesn't exist to be updated");
      }
      throw error;
    }
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
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
    try {
      return await this.userService.partialUpdate(
        updateParitialUserDto,
        userId,
      );
    } catch (error) {
      if (error instanceof UserNotExistException) {
        throw new NotFoundException("User doesn't exist to be updated");
      }
      throw error;
    }
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Delete profile',
    description: 'Delete user profile with user id',
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
    try {
      await this.userService.deleteById(userId);
    } catch (error) {
      if (error instanceof UserNotExistException) {
        throw new NotFoundException("User doesn't exist to be deleted");
      }
    }
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
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
  @ApiNotFoundResponse({
    description: "User doesn't exist to have sources",
    example: new NotFoundException("User doesn't exist to have sources"),
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
    try {
      return await this.userService.getSources(userId);
    } catch (error) {
      if (error instanceof UserNotExistException) {
        throw new NotFoundException("User doesn't exist to have sources");
      }
    }
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
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
  @ApiNotFoundResponse({
    description: "User doesn't exist to have sources to have tickets",
    example: new NotFoundException(
      "User doesn't exist to have sources to have tickets",
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
    try {
      return await this.userService.getTickets(userId);
    } catch (error) {
      if (error instanceof UserNotExistException) {
        throw new NotFoundException(
          "User doesn't exist to have sources to have tickets",
        );
      }
    }
  }
}
