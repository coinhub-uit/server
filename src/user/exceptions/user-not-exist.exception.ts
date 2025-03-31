export class UserNotExistException extends Error {
  constructor() {
    super("User doesn't exist");
  }
}
