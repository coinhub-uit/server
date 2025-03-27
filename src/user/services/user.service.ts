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

  // FIXME: maybe not right
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
    const user = await this.userRepository.findOneOrFail({
      where: {
        id: userId,
      },
    });
    return this.userRepository.remove(user);
  }

  getUsers() {
    return this.userRepository.find();
  }

  getUserByUsername(username: string) {
    return this.userRepository.findOneOrFail({ where: { username: username } });
  }

  getUserById(id: string) {
    return this.userRepository.findOneOrFail({ where: { id: id } });
  }
}
