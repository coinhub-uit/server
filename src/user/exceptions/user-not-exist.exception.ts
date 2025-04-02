export class UserNotExistException extends Error {
  constructor(message: string = 'User does not exist') {
    super();
    this.message = message;
  }
}
