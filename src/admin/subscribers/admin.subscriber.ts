import { AdminEntity } from 'src/admin/entities/admin.entity';
import { hash } from 'lib/hashing';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

@EventSubscriber()
export class AdminSubscriber implements EntitySubscriberInterface<AdminEntity> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return AdminEntity;
  }

  async beforeInsert(event: InsertEvent<AdminEntity>) {
    const admin = event.entity;
    admin.password = await hash(admin.password);
  }

  async beforeUpdate(event: UpdateEvent<AdminEntity>) {
    const admin = event.entity as AdminEntity;
    admin.password = await hash(admin.password);
  }
}
