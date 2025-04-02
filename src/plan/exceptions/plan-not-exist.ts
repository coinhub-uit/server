export class PlanNotExist extends Error {
  constructor() {
    super('This Plan is not existed');
  }
}
