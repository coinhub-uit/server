import { ServiceException } from 'src/common/exceptions/service.exception';

export class NotificationNotExistException extends ServiceException {
  constructor(notificationId: string) {
    super();
    this.message = `Notification with id ${notificationId} doesn't exist`;
  }
}
