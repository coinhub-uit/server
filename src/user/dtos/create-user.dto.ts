import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ApiSchema({
  name: 'Create User Request Schema',
})
export class CreateUserDto {
  @ApiProperty({
    description: 'Fullname',
    example: 'Tran Nguyen Chi Hen' satisfies CreateUserDto['fullname'],
  })
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @ApiProperty({
    description: 'Birth date',
    example: '3/31/2001' satisfies CreateUserDto['birthDate'],
  })
  @IsNotEmpty()
  @IsString()
  birthDate: string;

  @ApiProperty({
    description: 'Citizen ID',
    example: '077002455001' satisfies CreateUserDto['citizenId'],
  })
  @IsString()
  citizenId: string;

  @ApiProperty({
    required: false,
    description: 'Avatar URL',
    example:
      'https://avatars.githubusercontent.com/u/86353526?v=4' satisfies CreateUserDto['avatar'],
  })
  @IsString()
  avatar?: string;

  @ApiProperty({
    required: false,
    description: 'Address',
    example: '4011 Lowland Drive,Woodstock' satisfies CreateUserDto['address'],
  })
  @IsString()
  address?: string;

  @ApiProperty({
    required: false,
    description: 'Phone number',
    example: '0945678910' satisfies CreateUserDto['phoneNumber'],
  })
  @IsString()
  phoneNumber?: string;
}
