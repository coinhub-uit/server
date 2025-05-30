import { Injectable } from '@nestjs/common';
import { TranferMoneyDto } from '../dtos/transfer-money.dto';
import { DataSource, EntityManager } from 'typeorm';
import { SourceEntity } from 'src/source/entities/source.entity';
import { NotificationEntity } from 'src/notification/entities/notification.entity';
import { TransferFromSourceNotExistsException } from 'src/payment/exceptions/transfer-from-source-not-exist.exception';
import { TransferToSourceNotExistsException } from 'src/payment/exceptions/transfer-to-source-not-exist.exception';

@Injectable()
export class PaymentService {
  constructor(private dataSource: DataSource) {}

  async tranferMoney(transferMoneyDto: TranferMoneyDto) {
    const now = new Date();

    const ticketEntity = await this.dataSource.manager.transaction(
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
          where: { id: transferMoneyDto.toSourceId },
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
          body: `You have received $${transferMoneyDto.money} from ${fromSourceEntity.user?.fullname}.
          Destination account: ${toSourceEntity.id}.
          Your new balance: $${toSourceEntity.balance.toNumber()}.`,
          user: toSourceEntity.user,
          createdAt: now,
        });

        const tranferMoneyNotification = notificationRepository.create({
          title: 'Money Tranferred',
          body: `You have transferred $${transferMoneyDto.money} to ${toSourceEntity.user?.fullname}.
          Source account: ${fromSourceEntity.id}.
          Remaining balance: $${fromSourceEntity.balance.toNumber()}.`,
          createdAt: now,
        });

        await notificationRepository.save(receivedMoneyNotification);
        await notificationRepository.save(tranferMoneyNotification);

        return fromSourceEntity;
      },
    );

    return ticketEntity;
  }
}
