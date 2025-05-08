import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream } from 'fs';
import { readdir, rename, unlink } from 'fs/promises';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { extname, join as joinPath } from 'path';
import { SourceResponseDto } from 'src/source/dtos/source.response.dto';
import { SourceEntity } from 'src/source/entities/source.entity';
import { TicketResponseDto } from 'src/ticket/dtos/ticket.response.dto';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { userPaginationConfig } from 'src/user/configs/user-pagination.config';
import { CreateUserRequestDto } from 'src/user/dtos/create-user.request.dto';
import { DeviceResponseDto } from 'src/user/dtos/device.response.dto';
import { RegisterDeviceRequestDto } from 'src/user/dtos/register-device.request.dto';
import { UpdateParitialUserRequestDto } from 'src/user/dtos/update-paritial-user.request.dto';
import { UpdateUserRequestDto } from 'src/user/dtos/update-user.request.dto';
import { UserResponseDto } from 'src/user/dtos/user.response.dto';
import { DeviceEntity } from 'src/user/entities/device.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { AvatarNotSetException } from 'src/user/exceptions/avatar-not-set.exception';
import { UserNotExistException } from 'src/user/exceptions/user-not-exist.exception';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    @InjectRepository(SourceEntity)
    private readonly sourceRepository: Repository<SourceEntity>,
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
  ) {}

  private static readonly AVATAR_FILENAME_FIRST_HEX_PATTERN = /^[^-]+-/;

  private async FindById(userId: string) {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
  }

  private async findByIdOrFail(userId: string) {
    const user = await this.FindById(userId);
    if (!user) {
      throw new UserNotExistException();
    }
    return user;
  }

  async find(userId: string) {
    const userEntity = await this.findByIdOrFail(userId);
    return userEntity as UserResponseDto;
  }

  static async deleteAvatarInStorageById(userId: string) {
    try {
      const dir = joinPath(process.cwd(), `${process.env.UPLOAD_PATH}/avatars`);
      const files = await readdir(dir);
      // NOTE: This doesn't clean the temp avatar
      const matchedFiles = files.filter((file) => file.startsWith(userId));
      await Promise.all(
        matchedFiles.map((file) => unlink(joinPath(dir, file))),
      );
    } catch (error) {
      console.error(`Failed to delete avatar files for user ${userId}:`, error);
    }
  }

  async createAvatar(userId: string, file: Express.Multer.File) {
    await UserService.deleteAvatarInStorageById(userId);
    const sanitizedFilename = file.filename.replace(
      UserService.AVATAR_FILENAME_FIRST_HEX_PATTERN,
      '',
    );
    const targetDir = file.destination;
    const oldPath = file.path;
    const newPath = joinPath(targetDir, sanitizedFilename);
    await rename(oldPath, newPath);
    return await this.userRepository.save({
      id: userId,
      avatar: sanitizedFilename,
    });
  }

  async deleteAvatarById(userId: string) {
    const user = await this.findByIdOrFail(userId);
    await UserService.deleteAvatarInStorageById(userId);
    user.avatar = null;
    await this.userRepository.save(user);
  }

  async getAvatarById(userId: string) {
    const user = await this.findByIdOrFail(userId);
    if (!user.avatar) {
      throw new AvatarNotSetException();
    }
    const filename = user.avatar;
    const file = createReadStream(
      joinPath(process.cwd(), `${process.env.UPLOAD_PATH}/avatars/${filename}`),
    );
    const fileExtension = extname(filename);
    return { file, filename, fileExtension };
  }

  async findAll(query: PaginateQuery) {
    return paginate(query, this.userRepository, userPaginationConfig);
  }

  async create(createUserRequestDto: CreateUserRequestDto) {
    const user = this.userRepository.create({ ...createUserRequestDto });
    await this.userRepository.insert(user);
    const userEntity = await this.findByIdOrFail(createUserRequestDto.id);
    return userEntity as UserResponseDto;
  }

  async updateById(userId: string, updateUserRequestDto: UpdateUserRequestDto) {
    const updateResult = await this.userRepository.update(userId, {
      ...updateUserRequestDto,
    });
    if (!updateUserRequestDto.avatar) {
      await UserService.deleteAvatarInStorageById(userId);
    }
    if (updateResult.affected === 0) {
      throw new UserNotExistException();
    }
  }

  async partialUpdateById(
    userId: string,
    updatePartialUserRequestDto: UpdateParitialUserRequestDto,
  ) {
    const user = await this.findByIdOrFail(userId);
    if (!updatePartialUserRequestDto.avatar) {
      try {
        await UserService.deleteAvatarInStorageById(userId);
      } catch (error) {
        console.error(
          `Failed to delete avatar files for user ${userId} during partial update.`,
          error,
        );
      }
    }
    const updatedUser = this.userRepository.merge(
      user,
      updatePartialUserRequestDto,
    );
    const userEntity = await this.userRepository.save(updatedUser);
    return userEntity as UserResponseDto;
  }

  private async deleteInSupabaseById(userId: string) {
    await fetch(
      `${process.env.SUPABASE_PROJECT_API_URL}/functions/v1/delete-user`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'text/plain',
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: userId,
      },
    );
  }

  // TODO: If soft delete / remove, return nothing
  async deleteById(userId: string) {
    await Promise.all([
      this.userRepository.softDelete({ id: userId }),
      this.deleteInSupabaseById(userId),
      UserService.deleteAvatarInStorageById(userId),
    ]);
  }

  async findSourcesById(userId: string) {
    const sourceEntities = await this.sourceRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
    return sourceEntities as SourceResponseDto[];
  }

  async findTicketsById(userId: string) {
    const ticketEntities = await this.ticketRepository.find({
      where: {
        source: {
          user: {
            id: userId,
          },
        },
      },
    });
    return ticketEntities as TicketResponseDto[];
  }

  async createDevice(
    userId: string,
    registerDeviceRequestDto: RegisterDeviceRequestDto,
  ) {
    const device = this.deviceRepository.create({
      fcmToken: registerDeviceRequestDto.fcmToken,
      id: registerDeviceRequestDto.deviceId,
      user: {
        id: userId,
      },
    });
    const deviceEntity = await this.deviceRepository.save(device);
    return deviceEntity as DeviceResponseDto;
  }

  async findAllUserInformation(userId: string) {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId },
      relations: {
        sources: {
          topUps: true,
          tickets: {
            ticketHistories: {
              planHistory: {
                plan: true,
              },
            },
          },
        },
        notifications: true,
      },
    });
    if (!user) {
      throw new UserNotExistException();
    }
    return user;
  }
}
