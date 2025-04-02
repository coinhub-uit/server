import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ApiSchema()
export class LoginAdminDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  username!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password!: string;
}
