export class UserConflictException extends Error {
  constructor(message: string = 'User conflict') {
    super();
    this.message = message;
  }
}
