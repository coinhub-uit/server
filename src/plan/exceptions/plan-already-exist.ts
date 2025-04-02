export class PlanAlreadyExist extends Error {
  constructor() {
    super('This plan is already exist');
  }
}
