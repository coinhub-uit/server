import type { Response } from 'express';
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
  UploadedFile,
  StreamableFile,
  Res,
  ParseFilePipe,
  HttpStatus,
  FileTypeValidator,
  MaxFileSizeValidator,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin.jwt-auth.guard';
import { UniversalJwtAuthGuard } from 'src/auth/guards/universal.jwt-auth.guard';
import { UniversalJwtRequest } from 'src/auth/types/universal.jwt-request';
import { UserNotExistException } from 'src/user/exceptions/user-not-exist.exception';
import { SourceEntity } from 'src/source/entities/source.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { UpdateParitialUserDto } from 'src/user/dtos/update-paritial-user.dto';
import { UpdateUserDto } from 'src/user/dtos/update-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { RegisterFcmTokenDto } from 'src/user/dtos/register-fcm-token.dto';
import { AvatarUploadDto } from 'src/user/dtos/avatar-upload.dto';
import { AvatarNotSetException } from 'src/user/exceptions/avatar-not-set.exception';
import { memoryStorage } from 'multer';

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
  @ApiOkResponse({
    description: 'Successful',
    type: [UserEntity],
  })
  @Get()
  async getAll() {
    return await this.userService.getAll();
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @ApiOperation({
    summary: 'Get avatar',
    description: 'Get avatar',
  })
  @ApiOkResponse()
  @ApiUnprocessableEntityResponse()
  @ApiNotFoundResponse()
  @Get(':id/avatar')
  async getAvatar(
    @Param('id') userId: string,
    @Req() req: Request & { user: UniversalJwtRequest },
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!req.user.isAdmin && req.user.userId !== userId) {
      throw new ForbiddenException('You are only allowed to get your avatar');
    }
    try {
      const { file, filename, fileExtension } =
        await this.userService.getAvatar(userId);
      res.set({
        'Content-Type': `image/${fileExtension}`,
        'Content-Disposition': `attachment; filename="${filename}"`,
      });
      return new StreamableFile(file);
    } catch (error) {
      if (error instanceof AvatarNotSetException) {
        throw new NotFoundException('Avatar not set');
      }
      throw error;
    }
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @ApiOperation({
    summary: 'Upload avatar',
    description: 'upload avatar and save it to storage',
  })
  @ApiBody({
    description: 'Avatar file',
    type: AvatarUploadDto,
  })
  @ApiConsumes('image/png', 'image/jpg', 'image/jpeg')
  @ApiCreatedResponse()
  @ApiUnprocessableEntityResponse()
  @ApiNotFoundResponse()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (_, file, callback) => {
        console.log(file.mimetype);
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
    file: Express.Multer.File,
    @Param('id') userId: string,
    @Req() req: Request & { user: UniversalJwtRequest },
  ) {
    if (!req.user.isAdmin && req.user.userId !== userId) {
      throw new ForbiddenException(
        'You are only allowed to upload your avatar',
      );
    }
    try {
      const avatarFilename = this.userService.generateAvatarFilename(
        userId,
        file,
      );
      const user = await this.userService.partialUpdate(
        { avatar: avatarFilename },
        userId,
      );
      await this.userService.saveAvatar(file, avatarFilename);
      return user;
    } catch (error) {
      if (error instanceof UserNotExistException) {
        throw new NotFoundException('User not found to upload avatar for');
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
    type: UserEntity,
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
  @ApiOkResponse({})
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
  @ApiUnprocessableEntityResponse()
  @ApiNoContentResponse() // NOTE: Is it? no content response? in reality
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

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Register FCM token',
    description: 'Register FCM token for a device of a user',
  })
  @ApiForbiddenResponse()
  @ApiOkResponse()
  @Post(':id/fcm-token')
  async registerFcmToken(
    @Req() req: Request & { user: UniversalJwtRequest },
    @Param('id') userId: string,
    @Body() registerFcmTokenDto: RegisterFcmTokenDto,
  ) {
    if (!req.user.isAdmin && req.user.userId !== userId) {
      throw new ForbiddenException(
        "You are not allowed to register other user's FCM token slot",
      );
    }
    await this.userService.registerFcmToken({ userId, registerFcmTokenDto });
  }
}
