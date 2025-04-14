import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Decimal from 'decimal.js';
import { CreateSourceDto } from 'src/source/dtos/create-source.dto';
import { SourceEntity } from 'src/source/entities/source.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SourceService {
  constructor(
    @InjectRepository(SourceEntity)
    private readonly sourceRepository: Repository<SourceEntity>,
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

  async changeSourceBalance(money: Decimal.Value, source: SourceEntity) {
    source.balance.plus(money);
    return await this.sourceRepository.save(source);
  }

  async changeSourceBalanceById(money: Decimal.Value, sourceId: string) {
    const source = await this.sourceRepository.findOne({
      where: {
        id: sourceId,
      },
    });
    // TODO: Raise error ?
    if (!source) {
      return null;
    }
    source.balance = source.balance.plus(money);
    return await this.sourceRepository.save(source);
  }

  async getTickets(id: string) {
    const source = await this.getSourceByIdOrFail(id);
    return source.tickets;
  }

  async createSource(sourceDetails: CreateSourceDto) {
    const { userId, ...newSourceDetails } = sourceDetails;
    const source = this.sourceRepository.create({
      ...newSourceDetails,
      user: { id: userId },
    });
    try {
      const sourceEntity = await this.sourceRepository.save(source);
      return sourceEntity;
    } catch {
      // TODO: handle this later. Check usercontrller. not relly... right in this. no gneerate maps
    }
  }
}
