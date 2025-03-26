import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@ApiSchema({
  name: 'CreateVnpayTransaction',
  description: 'Payload use when make a transaction related to VNPay',
})
export class CreateVnpayTransactionDto {
  @ApiProperty({
    description: 'Source which receives money',
    examples: ['122354'],
  })
  @IsNotEmpty()
  @IsString()
  sourceDestination: string;

  @ApiProperty({
    description: 'Amount of money',
    examples: ['4550000'],
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'status of transaction',
  })
  @IsNotEmpty()
  isPaid: boolean;
}
