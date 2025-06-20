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
    example: '20c75444-798a-4708-9105-69de67e35c1c',
  })
  @IsNotEmpty()
  @IsUUID()
  id!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName!: string;

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
    example: '077002455001',
  })
  @IsString()
  @Length(12, 12)
  citizenId!: string;

  @ApiProperty({
    required: false,
    description: 'Avatar URL',
    example: 'https://avatars.githubusercontent.com/u/86353526?v=4',
  })
  @IsString()
  avatar?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  address?: string;
}
