import { ServiceException } from 'src/common/exceptions/service.exception';

export class AvatarNotSetException extends ServiceException {
  constructor(message: string = 'Avatar in this user is not set') {
    super();
    this.message = message;
  }
}
