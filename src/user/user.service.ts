import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { CreateUserParams } from 'src/user/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  createUser(userDetails: CreateUserParams) {
    const newUser = this.userRepository.create(userDetails);
    return this.userRepository.save(newUser);
  }

  getUsers() {
    return this.userRepository.find();
  }
}
