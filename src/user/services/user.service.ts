import { AvatarNotSetException } from 'src/user/exceptions/avatar-not-set.exception';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { DeviceEntity } from 'src/user/entities/device.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { RegisterDeviceDto } from 'src/user/dtos/register-device.dto';
import { Repository } from 'typeorm';
import { UpdateParitialUserDto } from 'src/user/dtos/update-paritial-user.dto';
import { UpdateUserDto } from 'src/user/dtos/update-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserNotExistException } from 'src/user/exceptions/user-not-exist.exception';
import { readdir, unlink } from 'fs/promises';
import { extname, join as joinPath } from 'path';
import { createReadStream } from 'fs';
import { URL_PATTERN } from 'lib/regex';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
  ) {}

  private async getById(userId: string) {
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  async getByIdOrFail(userId: string) {
    const user = await this.getById(userId);
    if (!user) {
      throw new UserNotExistException();
    }
    return user;
  }

  static async deleteAvatarInStorage(userId: string) {
    if (URL_PATTERN.test(userId)) {
      return;
    }
    const dir = joinPath(process.cwd(), `${process.env.UPLOAD_PATH}/avatars`);

    const files = await readdir(dir);
    const matchedFiles = files.filter((file) => file.startsWith(userId));
    await Promise.all(matchedFiles.map((file) => unlink(joinPath(dir, file))));
  }

  async deleteAvatarByUserId(userId: string) {
    const user = await this.getByIdOrFail(userId);
    await UserService.deleteAvatarInStorage(userId);
    user.avatar = null;
    await this.userRepository.save(user);
  }

  async getAvatar(userId: string) {
    const user = await this.getByIdOrFail(userId);
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
  async getAll() {
    return await this.userRepository.find();
  }

  async createUser(userDetails: CreateUserDto) {
    const user = this.userRepository.create(userDetails as UserEntity);
    await this.userRepository.insert(user);
    return this.userRepository.findOne({ where: { id: userDetails.id } });
  }

  async update(userDetails: UpdateUserDto, userId: string) {
    const updateResult = await this.userRepository.update(
      userId,
      userDetails as UserEntity,
    );
    if (!userDetails.avatar) {
      await UserService.deleteAvatarInStorage(userId);
    }
    if (updateResult.affected === 0) {
      throw new UserNotExistException();
    }
  }

  async partialUpdate(userDetails: UpdateParitialUserDto, userId: string) {
    const user = await this.getByIdOrFail(userId);
    if (!userDetails.avatar && user.avatar) {
      try {
        await UserService.deleteAvatarInStorage(userId);
      } catch {
        // NOTE: not need to handle this. Or maybe ...
      }
    }
    const updatedUser = this.userRepository.merge(user, userDetails);
    return await this.userRepository.save(updatedUser);
  }

  private async deleteSupabaseById(userId: string) {
    await fetch(
      `https://${process.env.SUPABASE_PROJECT_ID}.supabase.co/functions/v1/delete-user`,
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
      this.deleteSupabaseById(userId),
      UserService.deleteAvatarInStorage(userId),
    ]);
  }

  async getSources(userId: string) {
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

  async getTickets(userId: string) {
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
    const sources = user.sources;
    return sources.flatMap((source) => source.tickets);
  }

  async registerDevice({
    userId,
    registerDeviceDto: registerFcmTokenDto,
  }: {
    userId: string;
    registerDeviceDto: RegisterDeviceDto;
  }) {
    const device = this.deviceRepository.create({
      userId,
      fcmToken: registerFcmTokenDto.fcmToken,
      deviceId: registerFcmTokenDto.deviceId,
    });
    return await this.deviceRepository.save(device);
  }
}
