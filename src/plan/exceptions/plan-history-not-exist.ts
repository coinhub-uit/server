export class PlanHistoryNotExist extends Error {
  constructor() {
    super('This Plan is not exist or not available now');
  }
}
