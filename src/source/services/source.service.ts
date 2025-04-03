import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Decimal from 'decimal.js';
import { CreateSourceDto } from 'src/source/dtos/create-source.dto';
import { SourceEntity } from 'src/source/entities/source.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { SourceAlreadyExistException } from 'src/source/exceptions/source-already-exist';
import { UserService } from 'src/user/services/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class SourceService {
  constructor(
    @InjectRepository(SourceEntity)
    private readonly sourceRepository: Repository<SourceEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private userService: UserService,
  ) {}

  async getSourceByIdOrFail(sourceId: string) {
    const source = await this.sourceRepository.findOne({
      where: { id: sourceId },
    });
    if (!source) {
      throw new NotFoundException('Source Not found');
    }
    return source;
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
    try {
      const source = await this.getSourceByIdOrFail(id);
      return source.tickets;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async createSource(sourceDetails: CreateSourceDto) {
    const { userId, ...newSourceDetails } = sourceDetails;
    try {
      const user = await this.userService.getByIdOrFail(userId);
      const insertResult = await this.sourceRepository.insert({
        ...newSourceDetails,
        user: Promise.resolve(user),
      });
      if (insertResult.identifiers.length === 0) {
        throw new SourceAlreadyExistException();
      }
      return insertResult.generatedMaps[0] as SourceEntity;
    } catch {
      // TODO: handle this later. Check usercontrller. not relly... right in this. no gneerate maps
    }
  }
}
