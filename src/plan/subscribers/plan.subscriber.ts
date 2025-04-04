import { PlanEntity } from 'src/plan/entities/plan.entity';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';

@EventSubscriber()
export class PlanSubscriber implements EntitySubscriberInterface {
  listenTo() {
    return PlanEntity;
  }

  async afterInsert(event: InsertEvent<PlanEntity>) {
    await event.manager.query('REFRESH MATERIALIZED VIEW available_plan;');
  }

  async afterUpdate(event: UpdateEvent<PlanEntity>) {
    await event.manager.query('REFRESH MATERIALIZED VIEW available_plan;');
  }

  async afterRemove(event: RemoveEvent<PlanEntity>) {
    await event.manager.query('REFRESH MATERIALIZED VIEW available_plan;');
  }
}
