export class SourceAlreadyExistException extends Error {
  constructor(message: string = 'Source already exists') {
    super();
    this.message = message;
  }
}
