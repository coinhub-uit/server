import { ServiceException } from 'src/common/exceptions/service.exception';

export class TicketNotExistException extends ServiceException {
  constructor(ticketId: number) {
    super();
    this.message = `Ticket with id ${ticketId} does not exist`;
  }
}
