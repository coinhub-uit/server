import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Decimal from 'decimal.js';
import { CreateSourceDto } from 'src/source/dtos/create-source.dto';
import { SourceEntity } from 'src/source/entities/source.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SourceService {
  constructor(
    @InjectRepository(SourceEntity)
    private readonly sourceRepository: Repository<SourceEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getSourceById(sourceId: string) {
    return await this.sourceRepository.findOne({ where: { id: sourceId } });
  }

  async changeBalanceSource(money: Decimal, sourceId: string) {
    const source = await this.sourceRepository.findOne({
      where: {
        id: sourceId,
      },
    });
    if (!source) {
      return null;
    }
    source.balance = source.balance.plus(money);
    return await this.sourceRepository.save(source);
  }

  async getTickets(id: string) {
    const source = await this.sourceRepository.findOne({ where: { id: id } });
    if (!source) {
      return null;
    }
    return source.tickets;
  }

  async createSource(sourceDetails: CreateSourceDto) {
    const { userId, ...newSourceDetails } = sourceDetails;
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return null;
    }
    return this.sourceRepository.insert({ ...newSourceDetails, user });
  }
}
