import { ServiceException } from 'src/common/exceptions/service.exception';
import { PlanEntity } from 'src/plan/entities/plan.entity';

export class PlanNotExistException extends ServiceException {
  constructor(id: PlanEntity['id']) {
    super();
    this.message = `Plan with id ${id} does not exist`;
  }
}
