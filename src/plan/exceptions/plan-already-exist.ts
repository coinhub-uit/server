import { ServiceException } from 'src/common/exceptions/service.exception';

export class PlanAlreadyExistException extends ServiceException {
  constructor(message: string = 'Plan already exist') {
    super();
    this.message = message;
  }
}
