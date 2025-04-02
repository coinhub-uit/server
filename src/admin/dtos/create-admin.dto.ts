import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ApiSchema()
export class CreateAdminDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  username!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password!: string;
}
