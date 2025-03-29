import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { UpdateParitialUserDto } from 'src/user/dtos/update-paritial-user.dto';
import { UpdateUserDto } from 'src/user/dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(userDetails: CreateUserDto) {
    const user = this.userRepository.create({ ...userDetails });
    return this.userRepository.insert(user);
  }

  async getSources(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return null;
    }
    return user.sources;
  }

  getTickets(userId: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.sources', 'source')
      .leftJoinAndSelect('source.tickets', 'ticket')
      .where('user.id=:userId', { userId });
  }

  async updateUser(userDetails: UpdateUserDto) {
    await this.userRepository.findOneOrFail({
      where: { id: userDetails.id },
    });
    return this.userRepository.save(userDetails);
  }

  async updatePartialUser(userDetails: UpdateParitialUserDto) {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userDetails.id },
    });
    Object.assign(user, userDetails);
    return this.userRepository.save(user);
  }

  async deleteUserById(userId: string) {
    const user = await this.userRepository.findOneByOrFail({
      id: userId,
    });
    return await this.userRepository.remove(user);
  }

  async getUsers() {
    return await this.userRepository.find();
  }

  async getUserByUsername(username: string) {
    return await this.userRepository.findOneBy({ username });
  }

  async getUserById(id: string) {
    return await this.userRepository.findOneBy({ id });
  }
}
