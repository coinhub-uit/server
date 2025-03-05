export class CreateUserDto {
  readonly userId: string;

  readonly userName: string;

  readonly fullName: string;

  readonly birthDay: string;

  readonly pin: string;

  readonly avatar?: Buffer;

  readonly address?: string;

  readonly email?: string;

  readonly phoneNumber?: string;
}
