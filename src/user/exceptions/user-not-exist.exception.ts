import { ServiceException } from 'src/common/exceptions/service.exception';

export class UserNotExistException extends ServiceException {
  constructor(message: string = 'User does not exist') {
    super();
    this.message = message;
  }
}
