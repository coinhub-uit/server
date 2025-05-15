import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from 'src/notification/entities/notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  getNotificationById(id: string) {
    return this.notificationRepository.findOneOrFail({ where: { id: id } });
  }

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
