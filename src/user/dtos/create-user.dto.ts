import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import {
  Transform,
  TransformFnParams,
  TransformationType,
  ClassTransformOptions,
} from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

class PinTranformFnParams implements TransformFnParams {
  value: string | number;
  key: string;
  obj: any;
  type: TransformationType;
  options: ClassTransformOptions;
}

@ApiSchema({
  name: 'Create User Request Schema',
})
export class CreateUserDto {
  @ApiProperty({
    description: 'UUID of the user retreive from supabase',
    examples: ['20c75444-798a-4708-9105-69de67e35c1c'],
  })
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Username',
    examples: ['chihencube123', 'luckycube321'],
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Fullname',
    examples: ['Huynh Thai Binh', 'Tran Nguyen Chi Hen'],
  })
  @IsNotEmpty()
  fullname: string;

  @ApiProperty({
    description: 'Birth date',
    examples: ['3/31/2001', '4/4/1698'],
  })
  @IsNotEmpty()
  birthDate: string;

  // TODO: @NTGNguyen: validate only 4 char
  @ApiProperty({
    description: 'PIN code',
    oneOf: [
      { type: 'string', maxLength: 4, example: '1234' },
      { type: 'number', minimum: 0, maximum: 9999, example: 1234 },
    ],
  })
  @Transform(
    ({ value }: PinTranformFnParams) =>
      typeof value === 'number' ? value.toString() : value,
    { toClassOnly: true },
  )
  pin: string;

  @ApiProperty({
    nullable: true,
    description: 'Avatar',
    examples: ['https://avatars.githubusercontent.com/u/86353526?v=4'],
  })
  avatar?: string;

  @ApiProperty({
    nullable: true,
    description: 'Address',
    examples: ['4011 Lowland Drive,Woodstock', '429 Whitman Court, Stamford'],
  })
  address?: string;

  @ApiProperty({
    nullable: true,
    description: 'Phone number',
    examples: ['0945678910'],
  })
  phoneNumber?: string;
}
