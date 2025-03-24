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
@ApiSchema()
export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  birthDay: string;

  @ApiProperty()
  @Transform(
    ({ value }: PinTranformFnParams) =>
      typeof value === 'number' ? value.toString() : value,
    { toClassOnly: true },
  )
  pin: string;

  // FIXME: maybe add more description will emit the Buffer
  @ApiProperty()
  avatar?: Buffer;

  @ApiProperty()
  address?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  phoneNumber?: string;
}
