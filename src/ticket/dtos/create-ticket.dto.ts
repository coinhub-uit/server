import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { MethodEnum } from 'src/method/types/method.enum';

@ApiSchema()
export class CreateTicketDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sourceId!: string;

  @ApiProperty({ enum: MethodEnum })
  @IsString()
  @IsNotEmpty()
  methodId!: MethodEnum;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  planHistoryId!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount!: number;
}
