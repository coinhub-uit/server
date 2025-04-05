import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@ApiSchema()
export class TranferMoneysDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fromSourceId!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  toSourceId!: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  money!: number;
}
