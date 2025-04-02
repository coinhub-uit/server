import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { UpdateParitialUserDto } from 'src/user/dtos/update-paritial-user.dto';
import { UpdateUserDto } from 'src/user/dtos/update-user.dto';
import { UserAlreadyExistException } from 'src/user/exceptions/user-already-exist.exception';
import { UserNotExistException } from 'src/user/exceptions/user-not-exist.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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

  // TODO: Maybe paginate this
  async getAll() {
    return await this.userRepository.find();
  }

  async createUser(userDetails: CreateUserDto, userId: string) {
    const user = this.userRepository.create({ ...userDetails, id: userId });
    const insertResult = await this.userRepository.insert(user);
    if (insertResult.identifiers.length === 0) {
      throw new UserAlreadyExistException();
    }
    return insertResult.generatedMaps[0] as UserEntity;
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

  async partialUpdate(userDetails: UpdateParitialUserDto, userId: string) {
    const user = await this.getByIdOrFail(userId);
    const updatedUser = this.userRepository.merge(user, userDetails);
    return await this.userRepository.save(updatedUser);
  }

  // TODO: If soft delete / remove, return nothing
  async deleteById(userId: string) {
    const user = await this.getByIdOrFail(userId);
    return await this.userRepository.remove(user);
  }

  async getSources(userId: string) {
    const user = await this.getByIdOrFail(userId);
    return await user.sources;
  }

  async getTickets(userId: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.sources', 'source')
      .leftJoinAndSelect('source.tickets', 'ticket')
      .where('user.id = :userId', { userId })
      .getOne();
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
