import { ServiceException } from 'src/common/exceptions/service.exception';

export class TicketNotExistException extends ServiceException {
  constructor(message: string = 'Ticket does not exist') {
    super();
    this.message = message;
  }
}
