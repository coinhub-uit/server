import { Injectable } from '@nestjs/common';
import { TranferMoneyDto } from '../dtos/transfer-money.dto';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { SourceEntity } from 'src/source/entities/source.entity';
import { NotificationEntity } from 'src/notification/entities/notification.entity';
import { TransferFromSourceNotExistsException } from 'src/payment/exceptions/transfer-from-source-not-exist.exception';
import { TransferToSourceNotExistsException } from 'src/payment/exceptions/transfer-to-source-not-exist.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { TopUpEntity } from 'src/payment/entities/top-up.entity';
import { TopUpNotExistException } from 'src/payment/exceptions/top_up-not-exist';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(TopUpEntity)
    private readonly topUpRepository: Repository<TopUpEntity>,
    private dataSource: DataSource,
  ) {}

  async getTopUpById(topUpId: string) {
    const topUp = await this.topUpRepository.findOne({
      where: {
        id: topUpId,
      },
    });
    if (!topUp) {
      throw new TopUpNotExistException(topUpId);
    }
    return topUp;
  }

  async tranferMoney(transferMoneyDto: TranferMoneyDto) {
    const now = new Date();

    await this.dataSource.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const sourceRepository =
          transactionalEntityManager.getRepository(SourceEntity);
        const notificationRepository =
          transactionalEntityManager.getRepository(NotificationEntity);

        const fromSourceEntity = await sourceRepository.findOne({
          where: {
            id: transferMoneyDto.fromSourceId,
          },
          relations: {
            user: true,
          },
        });

        const toSourceEntity = await sourceRepository.findOne({
          where: {
            id: transferMoneyDto.toSourceId,
          },
          relations: {
            user: true,
          },
        });

        if (!fromSourceEntity) {
          throw new TransferFromSourceNotExistsException(
            transferMoneyDto.fromSourceId,
          );
        }

        if (!toSourceEntity) {
          throw new TransferToSourceNotExistsException(
            transferMoneyDto.toSourceId,
          );
        }

        fromSourceEntity.balance.minus(transferMoneyDto.money);
        toSourceEntity.balance.plus(transferMoneyDto.money);

        await sourceRepository.update(
          transferMoneyDto.fromSourceId,
          fromSourceEntity,
        );

        await sourceRepository.update(
          transferMoneyDto.toSourceId,
          toSourceEntity,
        );

        const receivedMoneyNotification = notificationRepository.create({
          title: 'Money Received',
          body: `You have received $${transferMoneyDto.money} from ${fromSourceEntity.user!.fullName}.
          Destination account: ${toSourceEntity.id}.
          Your new balance: $${toSourceEntity.balance.toNumber()}.`,
          user: toSourceEntity.user!,
          createdAt: now,
        });

        const tranferMoneyNotification = notificationRepository.create({
          title: 'Money Tranferred',
          body: `You have transferred $${transferMoneyDto.money} to ${toSourceEntity.user!.fullName}.
          Source account: ${fromSourceEntity.id}.
          Remaining balance: $${fromSourceEntity.balance.toNumber()}.`,
          user: fromSourceEntity.user!,
          createdAt: now,
        });

        await notificationRepository.insert([
          receivedMoneyNotification,
          tranferMoneyNotification,
        ]);

        return fromSourceEntity;
      },
    );
  }
}
