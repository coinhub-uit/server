import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  MaxDate,
} from 'class-validator';
import { stringToDate } from 'src/common/transformers/date.transformer';

@ApiSchema()
export class CreateUserDto {
  @ApiProperty({
    description: 'UUID of the user retreive from supabase',
    example:
      '20c75444-798a-4708-9105-69de67e35c1c' satisfies CreateUserDto['id'],
  })
  @IsNotEmpty()
  @IsUUID()
  id!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullname!: string;

  @ApiProperty({
    description:
      'Any string can be initialise by Date class of JS, can be ISO format also',
    example: '2005-9-27',
    examples: ['2005-9-27', new Date('2005-9-27').toISOString()],
  })
  @Transform(stringToDate)
  @IsDate()
  @MaxDate(() => new Date())
  birthDate!: Date;

  @ApiProperty({
    description: 'Citizen ID with 12 digits',
    example: '077002455001' satisfies CreateUserDto['citizenId'],
  })
  @IsString()
  @Length(12, 12)
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

  @ApiProperty({
    required: false,
    description: 'Phone number with 10 digits',
    example: '0945678910' satisfies CreateUserDto['phoneNumber'],
  })
  @IsString()
  @Length(10, 10)
  phoneNumber?: string;
}
