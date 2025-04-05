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
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin.jwt-auth.guard';
import { UniversalJwtAuthGuard } from 'src/auth/guards/universal.jwt-auth.guard';
import { UserJwtAuthGuard } from 'src/auth/guards/user.jwt-auth.guard';
import { UniversalJwtRequest } from 'src/auth/types/universal.jwt-request';
import { avatarStorageOptions } from 'src/config/avatar-storage-options.config';
import { UserNotExistException } from 'src/exceptions/user-not-exist.exception';
import { SourceEntity } from 'src/source/entities/source.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { CreateUserRequestDto } from 'src/user/dtos/requests/create-user.request.dto';
import { UpdateParitialUserRequestDto } from 'src/user/dtos/requests/update-paritial-user.request.dto';
import { UpdateUserRequestDto } from 'src/user/dtos/requests/update-user.request.dto';
import { CreateUserResponseDto } from 'src/user/dtos/responses/create-user.response.dto';
import { UpdateParitialUserResponseDto } from 'src/user/dtos/responses/update-paritial-user.response.dto';
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

  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth('user')
  @ApiOperation({})
  @ApiOkResponse({})
  @ApiNotFoundResponse({})
  @Post(':id/:avatar-url')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage(avatarStorageOptions),
    }),
  )
  async uploadAvatar(
    @Param('id') id: string,
    @Param('avatarUrl') avatarUrl: string,
  ) {
    try {
      return await this.userService.partialUpdate(
        {
          avatar: avatarUrl,
        } as UpdateParitialUserRequestDto,
        id,
      );
    } catch (error) {
      if (error instanceof UserNotExistException) {
        throw new NotFoundException('User not found to be paritial updated');
      }
      throw error;
    }
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @ApiOperation({
    summary: 'Register profile',
    description:
      "Register a profile for existed user in Supabase's auth database. (User only)",
  })
  @ApiForbiddenResponse()
  @ApiUnprocessableEntityResponse({
    description: 'User already exists, or constraint error',
  })
  @ApiCreatedResponse({
    type: CreateUserResponseDto,
  })
  @Post()
  async create(
    @Req() req: Request & { user: UniversalJwtRequest },
    @Body() createUserDto: CreateUserRequestDto,
  ) {
    if (!req.user.isAdmin && req.user.userId !== createUserDto.id) {
      throw new ForbiddenException(
        'You are only allowed to create your own profile',
      );
    }
    return await this.userService.createUser(createUserDto);
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Get profile',
    description: 'Get user profile by ID',
  })
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse({
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
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiUnprocessableEntityResponse()
  @ApiNoContentResponse()
  @Put(':id')
  async update(
    @Req() req: Request & { user: UniversalJwtRequest },
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserRequestDto,
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
        throw new NotFoundException('User not found to be updated');
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
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse({
    type: UpdateParitialUserResponseDto,
  })
  @Patch(':id')
  async updateParitial(
    @Req() req: Request & { user: UniversalJwtRequest },
    @Param('id') userId: string,
    @Body() updateParitialUserDto: UpdateParitialUserRequestDto,
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
        throw new NotFoundException('User not found to be paritial updated');
      }
      throw error;
    }
  }

  // NOTE: This require supabase client delete also
  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Delete profile',
    description: 'Delete user profile with user id',
  })
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  @Delete(':id')
  async delete(
    @Req() req: Request & { user: UniversalJwtRequest },
    @Param('id') userId: string,
  ) {
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
      throw error;
    }
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Get sources of user',
    description: 'Get all sources of user with user id',
  })
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse({
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
      throw error;
    }
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Get tickets of user',
    description: 'Get all tickets of user with user id',
  })
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse({
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
      throw error;
    }
  }
}
