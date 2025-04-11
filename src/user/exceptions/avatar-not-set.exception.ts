export class AvatarNotSetException extends Error {
  constructor(message: string = 'Avatar in this user is not set') {
    super();
    this.message = message;
  }
}
