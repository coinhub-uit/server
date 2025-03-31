import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { UpdateParitialUserDto } from 'src/user/dtos/update-paritial-user.dto';
import { UpdateUserDto } from 'src/user/dtos/update-user.dto';
import { TicketService } from 'src/ticket/services/ticket.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private ticketService: TicketService,
  ) {}

  async getAll() {
    return await this.userRepository.find();
  }

  async getById(userId: string) {
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  async createUser(userDetails: CreateUserDto, userId: string) {
    const user = this.userRepository.create({ id: userId, ...userDetails });
    return this.userRepository.insert(user);
  }

  async getSources(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return [];
    }
    return user.sources;
  }

  getTickets(userId: string) {
    return this.ticketService.getTicketByUserId(userId);
  }

  async update(userDetails: UpdateUserDto, userId: string) {
    await this.userRepository.findOneOrFail({
      where: { id: userId },
    });
    return this.userRepository.save(userDetails);
  }

  async partialUpdate(userDetails: UpdateParitialUserDto, userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      return null;
    }
    Object.assign(user, userDetails);
    return this.userRepository.save(user);
  }

  async deleteById(userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return null;
    }
    return await this.userRepository.remove(user);
  }
}
