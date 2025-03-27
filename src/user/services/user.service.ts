import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'src/common/utils/hashing';
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
    const user = this.userRepository.create({
      ...userDetails,
      pin: await hash(userDetails.pin),
    });
    return this.userRepository.insert(user);
  }

  // FIXME: maybe not right
  async updateUser(userDetails: UpdateUserDto) {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userDetails.id },
    });
    user.pin = await hash(userDetails.pin);
    Object.assign(user, userDetails);
    return this.userRepository.save(user);
  }

  async updatePartialUser(userDetails: UpdateParitialUserDto) {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userDetails.id },
    });
    if (userDetails.pin) {
      user.pin = await hash(userDetails.pin);
      delete userDetails.pin;
    }
    Object.assign(user, userDetails);
    return this.userRepository.save(user);
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
