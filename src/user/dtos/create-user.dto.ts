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

// TODO: Add docs later
@ApiSchema({
  name: 'CreateUserRequest',
  description: 'The payload of the user register request',
})
export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  birthDay: string;

  // TODO: @NTGNguyen: validate only 4 char
  @ApiProperty()
  @Transform(
    ({ value }: PinTranformFnParams) =>
      typeof value === 'number' ? value.toString() : value,
    { toClassOnly: true },
  )
  pin: string;

  @ApiProperty({ nullable: true })
  avatar?: string;

  @ApiProperty({ nullable: true })
  address?: string;

  @ApiProperty({ nullable: true })
  email?: string;

  @ApiProperty({ nullable: true })
  phoneNumber?: string;
}
