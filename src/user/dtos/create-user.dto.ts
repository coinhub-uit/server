import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  birthDay: string;
  pin: number;
  avatar?: Buffer;
  address?: string;
  email?: string;
  phoneNumber?: string;
}
