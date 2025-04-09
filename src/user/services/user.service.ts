import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserRequestDto } from 'src/user/dtos/requests/create-user.request.dto';
import { UpdateParitialUserRequestDto } from 'src/user/dtos/requests/update-paritial-user.request.dto';
import { UpdateUserRequestDto } from 'src/user/dtos/requests/update-user.request.dto';
import { UserNotExistException } from 'src/exceptions/user-not-exist.exception';
import { CreateUserResponseDto } from 'src/user/dtos/responses/create-user.response.dto';
import { UpdateParitialUserResponseDto } from 'src/user/dtos/responses/update-paritial-user.response.dto';
import { UserAlreadyExistException } from 'src/user/exceptions/user-already-exist.exception';
import { promisify } from 'util';
import * as fs from 'fs';
import { AvatarNotSetException } from 'src/user/exceptions/avatar-not-set.exception';

@Injectable()
export class UserService {
  private unlinkAsync = promisify(fs.unlink);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private async checkUserExistAndFail(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      throw new UserAlreadyExistException();
    }
    return user;
  }

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

  async createUser(userDetails: CreateUserRequestDto) {
    const user = this.userRepository.create(userDetails as UserEntity);
    const savedUser = await this.userRepository.save(user);
    return savedUser as CreateUserResponseDto;
  }

  async update(userDetails: UpdateUserRequestDto, userId: string) {
    const updateResult = await this.userRepository.update(
      userId,
      userDetails as UserEntity,
    );
    if (updateResult.affected === 0) {
      throw new UserNotExistException();
    }
  }

  async deleteAvatar(userId: string, filePath: string) {
    const user = await this.getById(userId);
    if (!user?.avatar) {
      throw new AvatarNotSetException();
    }
    await this.unlinkAsync(filePath);
    user.avatar = null;
    return await this.userRepository.save(user);
  }

  async partialUpdate(
    userDetails: UpdateParitialUserRequestDto,
    userId: string,
  ) {
    const user = await this.getByIdOrFail(userId);
    const updatedUser = this.userRepository.merge(user, userDetails);
    const newUser = await this.userRepository.save(updatedUser);
    return newUser as UpdateParitialUserResponseDto;
  }

  // TODO: If soft delete / remove, return nothing
  async deleteById(userId: string) {
    const user = await this.getByIdOrFail(userId);
    return await this.userRepository.remove(user);
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
    return await user.sources;
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
    const sources = await user.sources;
    const tickets = (
      await Promise.all(sources.map(async (source) => await source.tickets))
    ).flat();
    return tickets;
  }
}
