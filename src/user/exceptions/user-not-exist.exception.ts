import { ServiceException } from 'src/common/exceptions/service.exception';

export class UserNotExistException extends ServiceException {
  constructor(userId: string) {
    super();
    this.message = `User with id ${userId} does not exist`;
  }
}
