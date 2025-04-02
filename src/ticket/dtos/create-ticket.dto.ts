import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ApiSchema()
export class CreateTicketDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sourceId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  methodId: 'NR' | 'PR' | 'PIR';
}
