import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ApiSchema()
export class CreateSourceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId!: string;
}
