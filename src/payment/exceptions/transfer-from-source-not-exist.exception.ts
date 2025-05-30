import { ServiceException } from 'src/common/exceptions/service.exception';

export class TransferFromSourceNotExistsException extends ServiceException {
  constructor(sourceId: string) {
    super();
    this.message = `From source with source id ${sourceId} not exist`;
  }
}
