import { ServiceException } from 'src/common/exceptions/service.exception';
import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';

export class PlanHistoryNotExistException extends ServiceException {
  constructor(id: PlanHistoryEntity['id']) {
    super();
    this.message = `Plan history with id ${id} does not exist`;
  }
}
