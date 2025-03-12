import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ApiSchema({
  name: 'CreateAdminRequest',
  description: 'The payload schema for body of creating admin',
})
export class CreateAdminDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Username',
    example: 'GuessMe',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Password',
    example: 'StealMe!!',
  })
  password: string;
}
