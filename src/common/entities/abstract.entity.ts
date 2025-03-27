export class AbstractEntity<T> {
  constructor(entity?: Partial<T>) {
    if (!entity) {
      return;
    }
    Object.assign(this, entity);
  }
}
