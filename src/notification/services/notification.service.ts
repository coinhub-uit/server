import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from 'src/notification/entities/notification.entity';
import { NotificationForbiddenException } from 'src/notification/exceptions/notification-forbidden.exception';
import { NotificationNotExistException } from 'src/notification/exceptions/notification-not-exist.exception';
import { DataSource, EntityManager, Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    private dataSource: DataSource,
  ) {}

  async getNotificationById(
    notificationId: string,
    userIdOrIsAdmin: string | true,
  ) {
    const notificationEntity = await this.dataSource.manager.transaction(
      async (transactionEntityManager: EntityManager) => {
        const notificationRepository =
          transactionEntityManager.getRepository(NotificationEntity);
        const notificationEntity = await notificationRepository.findOne({
          where: {
            id: notificationId,
          },
          relations: {
            user: true,
          },
        });
        if (!notificationEntity) {
          throw new NotificationNotExistException(notificationId);
        }
        if (
          userIdOrIsAdmin !== true &&
          notificationEntity.user!.id !== userIdOrIsAdmin
        ) {
          throw new NotificationForbiddenException(notificationId);
        }

        return notificationEntity;
      },
    );
    return notificationEntity;
  }

  async markNotificationAsReadById(
    notificationId: string,
    userIdOrIsAdmin: string | true,
  ) {
    await this.dataSource.manager.transaction(
      async (transactionEntityManager: EntityManager) => {
        const notificationRepository =
          transactionEntityManager.getRepository(NotificationEntity);
        const notificationEntity = await notificationRepository.findOne({
          where: {
            id: notificationId,
          },
          relations: {
            user: true,
          },
        });

        if (!notificationEntity) {
          throw new NotificationNotExistException(notificationId);
        }

        if (
          userIdOrIsAdmin !== true &&
          notificationEntity.user!.id !== userIdOrIsAdmin
        ) {
          throw new NotificationForbiddenException(notificationId);
        }

        await notificationRepository.update(notificationId, {
          isRead: true,
        });
      },
    );
  }

  // FIXME: No usage?
  async create(userId: string, title: string, body: string, createdAt: Date) {
    const notification = this.notificationRepository.create({
      title: title,
      body: body,
      createdAt: createdAt,
      user: {
        id: userId,
      },
    });
    return await this.notificationRepository.save(notification);
  }
}
