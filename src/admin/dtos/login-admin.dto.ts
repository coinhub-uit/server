import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ApiSchema({
  name: 'Login Admin Payload',
  description: 'The payload schema for body of login admin',
})
export class LoginAdminDto {
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
