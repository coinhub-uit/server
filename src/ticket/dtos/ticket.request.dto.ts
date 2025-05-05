import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { MethodEnum } from 'src/ticket/types/method.enum';

@ApiSchema()
export class TicketRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sourceId!: string;

  @ApiProperty({ enum: MethodEnum })
  @IsString()
  @IsNotEmpty()
  method!: MethodEnum;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  planHistoryId!: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount!: number;
}
