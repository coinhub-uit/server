export class AbstractEntity<T> {
  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
