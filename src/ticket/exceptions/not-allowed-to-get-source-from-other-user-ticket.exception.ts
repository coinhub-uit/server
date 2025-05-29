import { ServiceException } from 'src/common/exceptions/service.exception';

export class NotAllowedToGetSourceFromOtherUserTicket extends ServiceException {
  constructor(ticketId: number) {
    super();
    this.message = `You are not allowed to get source from another user's ticket with ticket id: ${ticketId}`;
  }
}
