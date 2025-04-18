import { ServiceException } from 'src/common/exceptions/service.exception';
import { SourceEntity } from 'src/source/entities/source.entity';

export class SourceNotExistException extends ServiceException {
  constructor(sourceId: SourceEntity['id']) {
    super();
    this.message = `Source ${sourceId} does not exist`;
  }
}
