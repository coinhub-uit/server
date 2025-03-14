import { Controller, Get, Param } from '@nestjs/common';
import { NotificationService } from 'src/notification/services/notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get(':id')
  getNotificationbyId(@Param('id') id: string) {
    return this.notificationService.getNotificationById(id);
  }
}
