import { ServiceException } from 'src/common/exceptions/service.exception';

export class NotificationForbiddenException extends ServiceException {
  constructor(notificationId: string) {
    super();
    this.message = `Notification with id ${notificationId} isn't yours`;
  }
}
