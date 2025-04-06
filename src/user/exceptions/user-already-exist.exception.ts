import { ServiceException } from 'src/common/exceptions/service.exception';

export class UserAlreadyExistException extends ServiceException {
  constructor(message: string = 'User already exists') {
    super();
    this.message = message;
  }
}
