import { Injectable } from '@nestjs/common';
import { SourceService } from 'src/source/services/source.service';
import { TranferMoneysDto } from '../dtos/transfer-money.dto';
import { DataSource, EntityManager } from 'typeorm';
import { NotificationService } from 'src/notification/services/notification.service';
import { SourceEntity } from 'src/source/entities/source.entity';
import { NotificationEntity } from 'src/notification/entities/notification.entity';

@Injectable()
export class PaymentService {
  constructor(
    private readonly sourceService: SourceService,
    private readonly notificationService: NotificationService,
    private dataSource: DataSource,
  ) {}

  async tranferMoney(tranferMoneyDetails: TranferMoneysDto) {
    const now = new Date();
    await this.dataSource.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const sourceRepository =
          transactionalEntityManager.getRepository(SourceEntity);
        const notificationRepository =
          transactionalEntityManager.getRepository(NotificationEntity);

        const receivedMoneySource = await sourceRepository.findOneOrFail({
          where: { id: tranferMoneyDetails.toSourceId },
          relations: {
            user: true,
          },
        });
        const tranferMoneySource = await sourceRepository.findOneOrFail({
          where: {
            id: tranferMoneyDetails.fromSourceId,
          },
          relations: {
            user: true,
          },
        });
        receivedMoneySource.balance.plus(tranferMoneyDetails.money);
        tranferMoneySource.balance.minus(tranferMoneyDetails.money);
        await sourceRepository.save(tranferMoneySource);
        await sourceRepository.save(receivedMoneySource);

        const receivedMoneyNotification = notificationRepository.create({
          title: 'Money Received',
          body: `You have received $${tranferMoneyDetails.money} from ${tranferMoneySource.user?.fullname}.
          Destination account: ${receivedMoneySource.id}.
          Your new balance: $${receivedMoneySource.balance.toNumber()}.`,
          user: receivedMoneySource.user,
          createAt: now,
        });
        const tranferMoneyNotification = notificationRepository.create({
          title: 'Money Tranferred',
          body: `You have transferred $${tranferMoneyDetails.money} to ${receivedMoneySource.user?.fullname}.
          Source account: ${tranferMoneySource.id}.
          Remaining balance: $${tranferMoneySource.balance.toNumber()}.`,
        });
        await notificationRepository.save(receivedMoneyNotification);
        await notificationRepository.save(tranferMoneyNotification);
      },
    );
  }
}
