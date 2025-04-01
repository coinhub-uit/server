import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@ApiSchema()
export class CreateSourceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  balance!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId!: string;
}
