import { ServiceException } from 'src/common/exceptions/service.exception';

export class TicketHistoryNotExistException extends ServiceException {
  constructor(message: string = 'Ticket history not exist') {
    super();
    this.message = message;
  }
}
