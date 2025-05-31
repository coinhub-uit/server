import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Decimal from 'decimal.js';
import { CreateSourceDto } from 'src/source/dtos/create-source.dto';
import { SourceEntity } from 'src/source/entities/source.entity';
import { SourceAlreadyExistException } from 'src/source/exceptions/source-already-exist.exception';
import { SourceNotExistException } from 'src/source/exceptions/source-not-exist.execeptions';
import { SourceStillHasMoneyException } from 'src/source/exceptions/source-still-has-money.exceptions';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserNotExistException } from 'src/user/exceptions/user-not-exist.exception';
import { DataSource, EntityManager, Repository } from 'typeorm';

@Injectable()
export class SourceService {
  constructor(
    @InjectRepository(SourceEntity)
    private readonly sourceRepository: Repository<SourceEntity>,
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}

  async findByIdOrFail(sourceId: string) {
    const source = await this.sourceRepository.findOne({
      where: { id: sourceId },
    });
    if (!source) {
      throw new SourceNotExistException(sourceId);
    }
    return source;
  }

  async deleteSourceById(sourceId: string) {
    // PERF: Huhm find and delete?
    const source = await this.findByIdOrFail(sourceId);
    if (!source.balance.isZero()) {
      throw new SourceStillHasMoneyException(sourceId);
    }
    return this.sourceRepository.delete(sourceId);
  }

  async find(sourceId: string) {
    const sourceEntity = await this.findByIdOrFail(sourceId);
    return sourceEntity;
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
    const ticketEntities = await this.ticketRepository.find({
      where: {
        source: {
          id: sourceId,
        },
      },
      order: {
        ticketHistories: {
          issuedAt: 'DESC',
        },
      },
    });
    return ticketEntities;
  }

  async findUserBySourceId(sourceId: string) {
    const userEntity = await this.userRepository.findOne({
      where: {
        sources: {
          id: sourceId,
        },
      },
    });
    if (!userEntity) {
      throw new UserNotExistException(
        `No user have source with source id: ${sourceId}`,
      );
    }
    return userEntity;
  }

  async createSource(createSourceDto: CreateSourceDto, userId: string) {
    const sourceEntity = await this.dataSource.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const sourceRepository =
          transactionalEntityManager.getRepository(SourceEntity);

        const sourceAlreadyExist =
          (await sourceRepository.count({
            where: {
              id: createSourceDto.id,
            },
          })) === 1;
        if (sourceAlreadyExist) {
          throw new SourceAlreadyExistException(createSourceDto.id);
        }

        const source = sourceRepository.create({
          id: createSourceDto.id,
          balance: new Decimal(0),
          user: {
            id: userId,
          },
        });

        const sourceEntity = await sourceRepository.save(source);
        return sourceEntity;
      },
    );

    return sourceEntity;
  }
}
