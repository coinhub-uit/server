import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@ApiSchema({
  name: 'Create VNPAY payload',
})
export class CreateVnpayDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Return URL to client app',
    example: 'coinhub://home',
  })
  returnUrl: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'The amount of money',
    example: 100000,
  })
  amount: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'IP of the client',
    example: '42.114.190.170',
  })
  ipAddress: string;

  @IsString()
  @ApiProperty({
    description: '',
    example: '',
  })
  orderInfo: string;
}
