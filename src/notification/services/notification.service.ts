import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from 'src/notification/entities/notification.entity';
import { NotificationNotExistException } from 'src/notification/exceptions/notification-not-exist.exception';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  async getNotificationById(
    notificationId: string,
    userIdOrIsAdmin: string | true,
  ) {
    const notificationEntity = await this.notificationRepository.findOne({
      where: {
        id: notificationId,
        user: { id: userIdOrIsAdmin === true ? undefined : userIdOrIsAdmin },
      },
      order: {
        createdAt: 'DESC',
      },
    });
    if (!notificationEntity) {
      throw new NotificationNotExistException(notificationId);
    }
    return notificationEntity;
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
