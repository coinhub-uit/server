import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Decimal from 'decimal.js';
import { CreateSourceDto } from 'src/source/dtos/source.request.dto';
import { SourceResponseDto } from 'src/source/dtos/source.response.dto';
import { SourceEntity } from 'src/source/entities/source.entity';
import { SourceNotExistException } from 'src/source/exceptions/source-not-exist.execeptions';
import { TicketResponseDto } from 'src/ticket/dtos/ticket.response.dto';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SourceService {
  constructor(
    @InjectRepository(SourceEntity)
    private readonly sourceRepository: Repository<SourceEntity>,
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
  ) {}

  private async findByIdOrFail(sourceId: string) {
    const source = await this.sourceRepository.findOne({
      where: { id: sourceId },
    });
    if (!source) {
      throw new SourceNotExistException(sourceId);
    }
    return source;
  }

  async find(sourceId: string) {
    const sourceEntity = await this.findByIdOrFail(sourceId);
    return sourceEntity as SourceResponseDto;
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
    if (!source) {
      return null;
    }
    source.balance = source.balance.plus(money);
    return await this.sourceRepository.save(source);
  }

  async findTicketsBySourceId(sourceId: string) {
    const ticketEntities = await this.ticketRepository.find({
      where: {
        source: {
          id: sourceId,
        },
      },
    });
    return ticketEntities as TicketResponseDto[];
  }

  async createSource(sourceDetails: CreateSourceDto) {
    const { userId, ...newSourceDetails } = sourceDetails;
    const source = this.sourceRepository.create({
      ...newSourceDetails,
      user: { id: userId },
    });
    try {
      const sourceEntity = await this.sourceRepository.save(source);
      return sourceEntity as SourceResponseDto;
    } catch {
      // TODO: handle this later. Check usercontrller. not relly... right in this. no gneerate maps
    }
  }
}
