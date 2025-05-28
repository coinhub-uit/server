import { ServiceException } from 'src/common/exceptions/service.exception';

export class TicketAlreadyExistException extends ServiceException {
  constructor(message: string = 'Ticket already exists') {
    super();
    this.message = message;
  }
}
