import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream } from 'fs';
import { readdir, rename, unlink } from 'fs/promises';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { extname, join as joinPath } from 'path';
import { NotificationEntity } from 'src/notification/entities/notification.entity';
import { SourceEntity } from 'src/source/entities/source.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { TicketStatusEnum } from 'src/ticket/types/ticket-status.enum';
import { userPaginationConfig } from 'src/user/configs/user-pagination.config';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { RegisterDeviceDto } from 'src/user/dtos/register-device.dto';
import { UpdateParitialUserDto } from 'src/user/dtos/update-paritial-user.dto';
import { UpdateUserDto } from 'src/user/dtos/update-user.dto';
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
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  private static readonly AVATAR_FILENAME_FIRST_HEX_PATTERN = /^[^-]+-/;

  private async FindById(userId: string) {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
      withDeleted: true,
    });
  }

  async findByIdOrFail(userId: string) {
    const user = await this.FindById(userId);
    if (!user) {
      throw new UserNotExistException();
    }
    return user;
  }

  static async deleteAvatarInStorageById(userId: string) {
    try {
      const dir = joinPath(process.cwd(), `${process.env.UPLOAD_PATH}/avatars`);
      const files = await readdir(dir);
      // NOTE: This doesn't clean the temp avatar
      const matchedFiles = files.filter((file) => file.startsWith(userId));
      await Promise.all(
        matchedFiles.map((file) => {
          unlink(joinPath(dir, file));
        }),
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

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    await this.userRepository.insert(user);
    return this.findByIdOrFail(createUserDto.id);
  }

  async updateById(userId: string, updateUserDto: UpdateUserDto) {
    const updateResult = await this.userRepository.update(
      userId,
      updateUserDto,
    );
    if (!updateUserDto.avatar) {
      await UserService.deleteAvatarInStorageById(userId);
    }
    if (updateResult.affected === 0) {
      throw new UserNotExistException();
    }
  }

  async partialUpdateById(userId: string, userDetails: UpdateParitialUserDto) {
    const user = await this.findByIdOrFail(userId);
    if (userDetails.avatar === null) {
      await UserService.deleteAvatarInStorageById(userId);
    }
    const updatedUser = this.userRepository.merge(user, userDetails);
    return await this.userRepository.save(updatedUser);
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

  async deleteById(userId: string) {
    await this.userRepository.softDelete({ id: userId });
    await this.deleteInSupabaseById(userId);
    await UserService.deleteAvatarInStorageById(userId);
  }

  async findSourcesById(userId: string) {
    const sourceEntities = await this.sourceRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        id: 'ASC',
      },
    });
    return sourceEntities;
  }

  async findTicketsById({
    userId,
    activeTicketOnly,
    latestHistoryOnly,
  }: {
    userId: string;
    activeTicketOnly: boolean;
    latestHistoryOnly: boolean;
  }) {
    const ticketEntities = await this.ticketRepository.find({
      where: {
        source: {
          user: {
            id: userId,
          },
        },
        status: activeTicketOnly ? TicketStatusEnum.active : undefined,
      },
      order: {
        ticketHistories: {
          issuedAt: 'DESC',
        },
      },
    });

    if (latestHistoryOnly) {
      ticketEntities.forEach((ticket) => {
        ticket.ticketHistories = [ticket.ticketHistories[0]];
      });
    }
    return ticketEntities;
  }

  async findNotificationsById(userId: string) {
    const notificationEntities = await this.notificationRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return notificationEntities;
  }

  async createDevice(userId: string, registerDeviceDto: RegisterDeviceDto) {
    const device = this.deviceRepository.create({
      fcmToken: registerDeviceDto.fcmToken,
      id: registerDeviceDto.deviceId,
      user: {
        id: userId,
      },
    });
    return await this.deviceRepository.save(device);
  }
}
