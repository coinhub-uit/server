import { AdminEntity } from 'src/admin/entities/admin.entity';
import { hash } from 'src/common/utils/hashing';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<AdminEntity> {
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
}
