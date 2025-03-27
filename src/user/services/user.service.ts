import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(userDetails: CreateUserDto) {
    const newUser = this.userRepository.create({
      ...userDetails,
      avatar: userDetails.avatar
        ? Buffer.from(userDetails.avatar, 'utf8')
        : undefined,
    });
    return this.userRepository.save(newUser);
  }

  getUsers() {
    return this.userRepository.find();
  }

  getUserByUsername(username: string) {
    return this.userRepository.findOneOrFail({ where: { userName: username } });
  }

  getUserByEmail(email: string) {
    return this.userRepository.findOneOrFail({ where: { email: email } });
  }

  getUserById(id: string) {
    return this.userRepository.findOneOrFail({ where: { id: id } });
  }
}
