import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    return await this.sourceRepository.findOneByOrFail({ id: sourceId });
  }

  async changeBalanceSource(money: number, sourceId: string) {
    const source = await this.sourceRepository.findOneByOrFail({
      id: sourceId,
    });
    source.balance += money;
    return await this.sourceRepository.save(source);
  }

  async getSourceByUserId(userId: string) {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId },
    });
    return this.sourceRepository.findBy({ user: user });
  }

  async createSource(sourceDetails: CreateSourceDto) {
    const { userId, ...newSourceDetails } = sourceDetails;
    const user = await this.userRepository.findOneOrFail({
      where: {
        id: userId,
      },
    });

    return this.sourceRepository.insert({ ...newSourceDetails, user });
  }
}
