import { ServiceException } from 'src/common/exceptions/service.exception';
import { SourceEntity } from 'src/source/entities/source.entity';

export class SourceStillHasMoneyException extends ServiceException {
  constructor(sourceId: SourceEntity['id']) {
    super();
    this.message = `Source ${sourceId} still has money`;
  }
}
