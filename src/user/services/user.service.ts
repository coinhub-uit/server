import * as fs from 'fs';
import { AvatarNotSetException } from 'src/user/exceptions/avatar-not-set.exception';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { DeviceEntity } from 'src/user/entities/device.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { RegisterFcmTokenDto } from 'src/user/dtos/register-fcm-token.dto';
import { Repository } from 'typeorm';
import { UpdateParitialUserDto } from 'src/user/dtos/update-paritial-user.dto';
import { UpdateUserDto } from 'src/user/dtos/update-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserNotExistException } from 'src/user/exceptions/user-not-exist.exception';
import { promisify } from 'util';

@Injectable()
export class UserService {
  private unlinkAsync = promisify(fs.unlink);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
  ) {}

  // private async checkUserExistAndFail(userId: string) {
  //   const user = await this.userRepository.findOne({ where: { id: userId } });
  //   if (user) {
  //     throw new UserAlreadyExistException();
  //   }
  //   return user;
  // }
  //
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
    if (updateResult.affected === 0) {
      throw new UserNotExistException();
    }
  }

  async deleteAvatar(userId: string, filePath: string) {
    const user = await this.getByIdOrFail(userId);
    if (!user.avatar) {
      throw new AvatarNotSetException();
    }
    await this.unlinkAsync(filePath);
    user.avatar = null;
    return await this.userRepository.save(user);
  }

  async partialUpdate(userDetails: UpdateParitialUserDto, userId: string) {
    const user = await this.getByIdOrFail(userId);
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

  async registerFcmToken({
    userId,
    registerFcmTokenDto,
  }: {
    userId: string;
    registerFcmTokenDto: RegisterFcmTokenDto;
  }) {
    const device = this.deviceRepository.create({
      userId,
      fcmToken: registerFcmTokenDto.fcmToken,
      deviceId: registerFcmTokenDto.deviceId,
    });
    await this.deviceRepository.save(device);
  }
}
