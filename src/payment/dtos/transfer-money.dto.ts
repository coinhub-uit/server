import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
  money: number;

  // FIXME: Generate server itself, not client
  @IsDate()
  createAt: Date;
}
