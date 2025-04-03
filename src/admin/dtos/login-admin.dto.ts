import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ApiSchema()
export class LoginAdminDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'admin' })
  username!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'admin' })
  password!: string;
}
