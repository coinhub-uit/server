import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

@ApiSchema({
  name: 'Create User Request Schema',
})
export class CreateUserDto {
  @ApiProperty({
    description: 'UUID of the user retreive from supabase',
    example:
      '20c75444-798a-4708-9105-69de67e35c1c' satisfies CreateUserDto['id'],
  })
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Username',
    example: 'chihencube123' satisfies CreateUserDto['username'],
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Fullname',
    example: 'Tran Nguyen Chi Hen' satisfies CreateUserDto['fullname'],
  })
  @IsNotEmpty()
  fullname: string;

  @ApiProperty({
    description: 'Birth date',
    example: '3/31/2001' satisfies CreateUserDto['birthDate'],
  })
  @IsNotEmpty()
  birthDate: string;

  @ApiProperty({
    required: false,
    description: 'Avatar URL',
    example:
      'https://avatars.githubusercontent.com/u/86353526?v=4' satisfies CreateUserDto['avatar'],
  })
  avatar?: string;

  @ApiProperty({
    required: false,
    description: 'Address',
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
    description: 'Phone number',
    example: '0945678910' satisfies CreateUserDto['phoneNumber'],
  })
  phoneNumber?: string;
}
