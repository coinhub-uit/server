import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ApiSchema()
export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullname!: string;

  @ApiProperty({
    example: '3/31/2001' satisfies CreateUserDto['birthDate'],
  })
  @IsNotEmpty()
  @IsString()
  birthDate!: string;

  // TODO: validate 12 digits
  @ApiProperty({
    description: 'Citizen ID with 12 digits',
    example: '077002455001' satisfies CreateUserDto['citizenId'],
  })
  @IsString()
  citizenId!: string;

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
  })
  @IsString()
  address?: string;

  // TODO: validate 10 digits
  @ApiProperty({
    required: false,
    description: 'Phone number with 10 digits',
    example: '0945678910' satisfies CreateUserDto['phoneNumber'],
  })
  @IsString()
  phoneNumber?: string;
}
