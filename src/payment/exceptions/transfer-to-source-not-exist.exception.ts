import { ServiceException } from 'src/common/exceptions/service.exception';

export class TransferToSourceNotExistsException extends ServiceException {
  constructor(sourceId: string) {
    super();
    this.message = `To source with source id ${sourceId} not exist`;
  }
}
