import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

@ApiSchema({
  name: 'CreateUserRequest',
  description: 'The payload of the user register request',
})
export class CreateUserDto {
  @ApiProperty({
    description: 'UUID of user',
    example:
      '20c75444-798a-4708-9105-69de67e35c1c' satisfies CreateUserDto['userId'],
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'username of User',
    example: 'chihencube123' satisfies CreateUserDto['userName'],
  })
  @IsNotEmpty()
  userName: string;

  @ApiProperty({
    description: 'fullname of User',
    example: 'Tran Nguyen Chi Hen' satisfies CreateUserDto['fullName'],
  })
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'birthday of User',
    example: '3/31/2001' satisfies CreateUserDto['birthDay'],
  })
  @IsNotEmpty()
  birthDay: string;

  @ApiProperty({
    required: false,
    description: 'avatar of User Account ',
    example:
      'https://avatars.githubusercontent.com/u/86353526?v=4' satisfies CreateUserDto['avatar'],
  })
  avatar?: string;

  @ApiProperty({
    required: false,
    description: 'address',
    example: '4011 Lowland Drive,Woodstock' satisfies CreateUserDto['address'],
  })
  address?: string;

  @ApiProperty({
    required: false,
    description: 'Email of user account',
    example: 'luckycube2@doggg.com' satisfies CreateUserDto['email'],
  })
  email?: string;

  @ApiProperty({
    required: false,
    description: 'Phone of User',
    example: '0945678910' satisfies CreateUserDto['phoneNumber'],
  })
  phoneNumber?: string;
}
