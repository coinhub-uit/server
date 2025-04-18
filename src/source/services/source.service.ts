import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Decimal from 'decimal.js';
import { CreateSourceDto } from 'src/source/dtos/create-source.dto';
import { SourceEntity } from 'src/source/entities/source.entity';
import { SourceNotExistException } from 'src/source/exceptions/source-not-exist.execeptions';
import { Repository } from 'typeorm';

@Injectable()
export class SourceService {
  constructor(
    @InjectRepository(SourceEntity)
    private readonly sourceRepository: Repository<SourceEntity>,
  ) {}

  async existsByIdOrFail(sourceId: string) {
    if (!(await this.sourceRepository.exists({ where: { id: sourceId } }))) {
      throw new SourceNotExistException(sourceId);
    }
  }

  async findByIdOrFail(sourceId: string) {
    const source = await this.sourceRepository.findOne({
      where: { id: sourceId },
    });
    if (!source) {
      throw new SourceNotExistException(sourceId);
    }
    return source;
  }

  async changeSourceBalance(source: SourceEntity, money: Decimal.Value) {
    source.balance = source.balance.plus(money);
    return await this.sourceRepository.save(source);
  }

  async changeSourceBalanceById(sourceId: string, money: Decimal.Value) {
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

  async findTicketsBySourceId(sourceId: string) {
    const source = await this.sourceRepository.findOne({
      where: { id: sourceId },
      relations: { tickets: true },
    });
    if (!source) {
      throw new SourceNotExistException(sourceId);
    }
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
