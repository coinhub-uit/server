import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { unlink } from 'fs/promises';
import { diskStorage } from 'multer';
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin.jwt-auth.guard';
import { UniversalJwtAuthGuard } from 'src/auth/guards/universal.jwt-auth.guard';
import { UniversalJwtRequest } from 'src/auth/types/universal.jwt-request';
import { avatarStorageOptions } from 'src/config/avatar-storage-options.config';
import { NotificationEntity } from 'src/notification/entities/notification.entity';
import { SourceEntity } from 'src/source/entities/source.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { userPaginationConfig } from 'src/user/configs/user-pagination.config';
import { AvatarUploadDto } from 'src/user/dtos/avatar-upload.dto';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { RegisterDeviceDto } from 'src/user/dtos/register-device.dto';
import { UpdateParitialUserDto } from 'src/user/dtos/update-paritial-user.dto';
import { UpdateUserDto } from 'src/user/dtos/update-user.dto';
import { DeviceEntity } from 'src/user/entities/device.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { AvatarNotSetException } from 'src/user/exceptions/avatar-not-set.exception';
import { UserNotExistException } from 'src/user/exceptions/user-not-exist.exception';
import { UserService } from 'src/user/services/user.service';

@Controller('users')
export class UserController {
  private static readonly AVATAR_MIMETYPE_REGEX_PATTERN =
    /image\/(png|jpg|jpeg)/;

  private static readonly AVATAR_MAX_FILE_SIZE = 1024 * 1024 * 10; // 10MB

  constructor(private userService: UserService) {}

  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiOperation({
    summary: 'Get all profiles',
    description: "Get all users' profile",
  })
  @PaginatedSwaggerDocs(UserEntity, userPaginationConfig)
  @Get()
  async getAll(@Paginate() query: PaginateQuery) {
    return await this.userService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get avatar',
    description: 'Get avatar',
  })
  @ApiUnprocessableEntityResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @Get(':id/avatar')
  async getAvatar(
    @Param('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { file, filename, fileExtension } =
        await this.userService.getAvatarById(userId);
      res.set({
        'Content-Type': `image/${fileExtension}`,
        'Content-Disposition': `attachment; filename="${filename}"`,
      });
      return new StreamableFile(file);
    } catch (error) {
      if (error instanceof AvatarNotSetException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @ApiOperation({
    summary: 'Upload avatar',
    description: 'Upload avatar and save it to storage',
  })
  @ApiBody({
    description: 'Avatar file',
    type: AvatarUploadDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiNotFoundResponse()
  @ApiBadRequestResponse({ description: 'File may be unsupported' })
  @ApiCreatedResponse()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage(avatarStorageOptions),
      fileFilter: (_, file, callback) => {
        if (!UserController.AVATAR_MIMETYPE_REGEX_PATTERN.test(file.mimetype)) {
          return callback(
            new BadRequestException(
              'Only image files (png, jpg, jpeg) are allowed!',
            ),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: UserController.AVATAR_MAX_FILE_SIZE,
      },
    }),
  )
  @Post(':id/avatar')
  async uploadAvatar(
    @UploadedFile()
    file: Express.Multer.File, // Do we need to validate file size, mimetype here? already done by multer above
    @Param('id') userId: string,
    @Req() req: Request & { user: UniversalJwtRequest },
  ) {
    if (!req.user.isAdmin && req.user.userId !== userId) {
      await unlink(file.path);
      throw new ForbiddenException(
        'You are only allowed to upload your avatar',
      );
    }
    try {
      return await this.userService.createAvatar(userId, file);
    } catch (error) {
      await unlink(file.path);
      if (error instanceof UserNotExistException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @ApiOperation({
    summary: 'Delete avatar',
    description:
      'Delete avatar for a user, clean in storage if stored in storage',
  })
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @Delete(':id/avatar')
  async deleteAvatar(
    @Param('id') userId: string,
    @Req() req: Request & { user: UniversalJwtRequest },
  ) {
    if (!req.user.isAdmin && req.user.userId !== userId) {
      throw new ForbiddenException(
        'You are only allowed to delete your avatar',
      );
    }
    try {
      await this.userService.deleteAvatarById(userId);
    } catch (error) {
      if (error instanceof UserNotExistException) {
        throw new NotFoundException(error.message);
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
    type: () => UserEntity,
  })
  @Post()
  async create(
    @Req() req: Request & { user: UniversalJwtRequest },
    @Body() createUserDto: CreateUserDto,
  ) {
    if (!req.user.isAdmin && req.user.userId !== createUserDto.id) {
      throw new ForbiddenException(
        'You are only allowed to create your own profile',
      );
    }
    return await this.userService.create(createUserDto);
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
    type: () => UserEntity,
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
      const user = await this.userService.findByIdOrFail(id);
      return user;
    } catch (error) {
      if (error instanceof UserNotExistException) {
        throw new NotFoundException(error.message);
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
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (!req.user.isAdmin && req.user.userId !== userId) {
      throw new ForbiddenException(
        "You are not allowed to update other user's profile",
      );
    }
    try {
      await this.userService.updateById(userId, updateUserDto);
    } catch (error) {
      if (error instanceof UserNotExistException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Update paritial profile',
    description: "Update paritial user's profile",
  })
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
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
      return await this.userService.partialUpdateById(
        userId,
        updateParitialUserDto,
      );
    } catch (error) {
      if (error instanceof UserNotExistException) {
        throw new NotFoundException(error.message);
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
  @ApiForbiddenResponse()
  @ApiUnprocessableEntityResponse()
  @ApiOkResponse({
    description:
      "For easier to dev, this is made to not reflect the right flow. If there aren't that user ID to delete, still 200 return",
  })
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
    await this.userService.deleteById(userId);
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Get sources of user',
    description: 'Get all sources of user with user id',
  })
  @ApiForbiddenResponse()
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
    return await this.userService.findSourcesById(userId);
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
  @ApiOperation({ summary: 'Get tickets of user' })
  @ApiQuery({
    name: 'activeTicketOnly',
    required: false,
    default: true,
  })
  @ApiQuery({
    name: 'latestHistoryOnly',
    required: false,
    default: false,
  })
  @ApiForbiddenResponse()
  @ApiOkResponse({
    type: [TicketEntity],
  })
  @Get(':id/tickets')
  async getTickets(
    @Req() req: Request & { user: UniversalJwtRequest },
    @Param('id') userId: string,
    @Query('activeTicketOnly') activeTicketOnly: boolean = true,
    @Query('latestHistoryOnly') latestHistoryOnly: boolean = false,
  ) {
    if (!req.user.isAdmin && req.user.userId !== userId) {
      throw new ForbiddenException(
        "You are not allowed to get other user's tickets",
      );
    }
    return await this.userService.findTicketsById({
      userId,
      activeTicketOnly,
      latestHistoryOnly,
    });
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Get notifications of user',
  })
  @ApiNotFoundResponse()
  @ApiOkResponse({
    type: [NotificationEntity],
  })
  @Get(':id/notifications')
  async getNotifications(
    @Req() req: Request & { user: UniversalJwtRequest },
    @Param('id') userId: string,
  ) {
    if (!req.user.isAdmin && req.user.userId !== userId) {
      throw new ForbiddenException(
        "You are not allowed to get other user's notifications",
      );
    }
    const notificationEntities =
      await this.userService.findNotificationsById(userId);
    return notificationEntities;
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Register user devices (FCM)',
    description: 'Register user devices. Currently for FCM - push notification',
  })
  @ApiForbiddenResponse()
  @ApiCreatedResponse({ type: DeviceEntity })
  @Post(':id/devices')
  async registerDevice(
    @Req() req: Request & { user: UniversalJwtRequest },
    @Param('id') userId: string,
    @Body() registerDeviceDto: RegisterDeviceDto,
  ) {
    if (!req.user.isAdmin && req.user.userId !== userId) {
      throw new ForbiddenException(
        "You are not allowed to register other user's devices",
      );
    }
    return await this.userService.createDevice(userId, registerDeviceDto);
  }
}
