import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SourceEntity } from 'src/source/entities/source.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SourceService {
  constructor(
    @InjectRepository(SourceEntity)
    private readonly sourceRepository: Repository<SourceEntity>,
  ) {}

  async getSourceById(sourceId: string) {
    return await this.sourceRepository.findOneByOrFail({ id: sourceId });
  }

  async changeBalanceSource(money: number, sourceId: string) {
    const source = await this.sourceRepository.findOneByOrFail({
      id: sourceId,
    });
    source.balance += money;
    return await this.sourceRepository.save(source);
  }
}
