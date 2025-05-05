import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationResponseDto } from 'src/notification/dto/notification.response.dto';
import { NotificationEntity } from 'src/notification/entities/notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  // TODO: Raise?
  async getNotificationById(id: string) {
    const notificationEntity = await this.notificationRepository.findOneOrFail({
      where: { id: id },
    });
    return notificationEntity as NotificationResponseDto;
  }
}
