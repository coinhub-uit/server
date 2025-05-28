import { ServiceException } from 'src/common/exceptions/service.exception';

export class NotAllowedToCreateTicketFromOtherSourceException extends ServiceException {
  constructor(sourceId: string) {
    super();
    this.message = `You are not allowed to create ticket from another user's source with source id: ${sourceId}`;
  }
}
