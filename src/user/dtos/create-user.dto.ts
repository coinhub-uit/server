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
  name: 'CreateUserRequest',
  description: 'The payload of the user register request',
})
export class CreateUserDto {
  @ApiProperty({
    description: 'UUID of user',
    examples: ['20c75444-798a-4708-9105-69de67e35c1c'],
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'username of User',
    examples: ['chihencube123', 'luckycube321'],
  })
  @IsNotEmpty()
  userName: string;

  @ApiProperty({
    description: 'fullname of User',
    examples: ['Huynh Thai Binh', 'Tran Nguyen Chi Hen'],
  })
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'birthday of User',
    examples: ['3/31/2001', '4/4/1698'],
  })
  @IsNotEmpty()
  birthDay: string;

  // TODO: @NTGNguyen: validate only 4 char
  @ApiProperty({
    description: 'Pin of User Account',
    examples: ['132456', '896412'],
  })
  @Transform(
    ({ value }: PinTranformFnParams) =>
      typeof value === 'number' ? value.toString() : value,
    { toClassOnly: true },
  )
  pin: string;

  @ApiProperty({
    nullable: true,
    description: 'avatar of User Account ',
    examples: [
      'dGVzdCBpbWFnZSBkYXRhIHRoYXQgY2Fubm90IGJlIHByb2Nlc3NlZCBpbnRvIGEgaW1hZ2UgZmlsZSBvciBhbnkgY2FyaW91cyBlbmNvZGluZy4gU2VjdXJlIHRoZSBpbWFnZSBkYXRhIGluIHRoZSBpbnRlcm5hbCBkZXZlbG9wbWVudCBkYXQgb3IgdGVzdCBkYXRhIHRoYXQgYXJlIGVuY29kaW5nIHdpdGggQmFzZTY0Lg==',
    ],
  })
  avatar?: string;

  @ApiProperty({
    nullable: true,
    description: 'address',
    examples: ['4011 Lowland Drive,Woodstock', '429 Whitman Court, Stamford'],
  })
  address?: string;

  @ApiProperty({
    nullable: true,
    description: 'Email of user account',
    examples: ['luckycube2@doggg.com'],
  })
  email?: string;

  @ApiProperty({
    nullable: true,
    description: 'Phone of User',
    examples: ['0945678910`'],
  })
  phoneNumber?: string;
}
