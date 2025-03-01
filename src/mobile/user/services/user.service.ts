import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/mobile/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  //TODO: Handle later?
  async findOne(username: string) {
    return this.userRepository.findOneByOrFail({ username: username });
  }
}
