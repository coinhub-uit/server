import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@ApiSchema({
  name: 'TranferMoneyRequest',
  description:
    'The payload schema for transfering money from a source to another source',
})
export class TranferMoneysDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'From what Source ID',
    example: '123456',
  })
  fromSourceId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'To what source ID',
    example: '234567',
  })
  toSourceId: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Amount of money',
    example: '23000',
  })
  money: number;

  @IsDate()
  createAt: Date;
}
