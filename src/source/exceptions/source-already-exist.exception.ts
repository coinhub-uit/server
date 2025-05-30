import { ServiceException } from 'src/common/exceptions/service.exception';

export class SourceAlreadyExistException extends ServiceException {
  constructor(sourceId: string) {
    super();
    this.message = `Source with id ${sourceId} already exists`;
  }
}
