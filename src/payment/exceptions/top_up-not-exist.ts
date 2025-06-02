import { ServiceException } from 'src/common/exceptions/service.exception';

export class TopUpNotExistException extends ServiceException {
  constructor(topUpId: string) {
    super();
    this.message = `Top Up with ${topUpId} not exist`;
  }
}
