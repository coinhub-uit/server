import { ServiceException } from 'src/common/exceptions/service.exception';

export class TicketNotExistException extends ServiceException {
  constructor(message: string = 'Ticket not exist') {
    super();
    this.message = message;
  }
}
