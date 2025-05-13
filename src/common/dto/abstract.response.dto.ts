export class AbstractResponseDto<T> {
  constructor(entity: T) {
    if (!entity) {
      return;
    }
    Object.assign(this, entity);
  }
}
