import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream } from 'fs';
import { readdir, rename, unlink } from 'fs/promises';
import { extname, join as joinPath } from 'path';
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
  ) {}

  private static readonly AVATAR_FILENAME_FIRST_HEX_PATTERN = /^[^-]+-/;

  private async FindById(userId: string) {
    return await this.userRepository.findOne({ where: { id: userId } });
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

  // TODO: Maybe paginate this
  async findAll() {
    return await this.userRepository.find();
  }

  async create(userDetails: CreateUserDto) {
    const user = this.userRepository.create({ ...userDetails });
    await this.userRepository.insert(user);
    return this.findByIdOrFail(userDetails.id);
  }

  async updateById(userId: string, userDetails: UpdateUserDto) {
    const updateResult = await this.userRepository.update(userId, {
      ...userDetails,
    });
    if (!userDetails.avatar) {
      await UserService.deleteAvatarInStorageById(userId);
    }
    if (updateResult.affected === 0) {
      throw new UserNotExistException();
    }
  }

  async partialUpdateById(userId: string, userDetails: UpdateParitialUserDto) {
    const user = await this.findByIdOrFail(userId);
    if (!userDetails.avatar) {
      try {
        await UserService.deleteAvatarInStorageById(userId);
      } catch (error) {
        console.error(
          `Failed to delete avatar files for user ${userId} during partial update.`,
          error,
        );
      }
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
          'Content-Type': 'application/json',
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
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        sources: true,
      },
    });
    if (!user) {
      throw new UserNotExistException();
    }
    return user.sources;
  }

  async findTicketsById(userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        sources: {
          tickets: true,
        },
      },
    });
    if (!user) {
      throw new UserNotExistException();
    }
    const sources = user.sources!;
    return sources.flatMap((source) => source.tickets!);
  }

  async createDevice(userId: string, registerDeviceDto: RegisterDeviceDto) {
    const device = this.deviceRepository.create({
      userId,
      fcmToken: registerDeviceDto.fcmToken,
      deviceId: registerDeviceDto.deviceId,
    });
    return await this.deviceRepository.save(device);
  }
}
