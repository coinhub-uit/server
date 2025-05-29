import { ServiceException } from 'src/common/exceptions/service.exception';

export class NotAllowedToGetTicketFromOtherUser extends ServiceException {
  constructor(ticketId: number) {
    super();
    this.message = `You are not allowed to get ticket from another user with ticket id: ${ticketId}`;
  }
}
