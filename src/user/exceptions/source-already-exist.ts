export class SourceAlreadyExistException extends Error {
  constructor() {
    super('User already exists');
  }
}
