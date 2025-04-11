import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { MethodEnum } from 'src/ticket/types/method.enum';

@ApiSchema()
export class CreateTicketDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sourceId: string;

  @ApiProperty({ enum: MethodEnum })
  @IsString()
  @IsNotEmpty()
  method: MethodEnum;
}
