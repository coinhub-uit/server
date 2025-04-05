export class UserAlreadyExistException extends Error {
  constructor(message: string = 'User already exists') {
    super();
    this.message = message;
  }
}
