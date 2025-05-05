import { ServiceException } from 'src/common/exceptions/service.exception';

export class CreateVNPayTopUpFailedException extends ServiceException {
  constructor(message: string = 'Create VNPay topup failed') {
    super();
    this.message = message;
  }
}
