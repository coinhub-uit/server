import { PlanEntity } from 'src/plan/entities/plan.entity';
import { EntitySubscriberInterface, EventSubscriber } from 'typeorm';

@EventSubscriber()
export class PlanSubscriber implements EntitySubscriberInterface {
  listenTo() {
    return PlanEntity;
  }
}
