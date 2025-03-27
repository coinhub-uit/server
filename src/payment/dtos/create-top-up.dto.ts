import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TopUpEnum } from 'src/payment/types/top-up.enum';

@ApiSchema({
  name: 'Create VNPAY payload',
})
export class CreateTopUpDto {
  @IsNotEmpty()
  @IsEnum(TopUpEnum)
  @ApiProperty({
    description: 'Top up type (I mean,... provider?)',
    examples: [TopUpEnum.VNPAY, TopUpEnum.MOMO, TopUpEnum.ZALOPAY],
    enum: TopUpEnum,
  })
  type: TopUpEnum;

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
  @ApiProperty({
    description: 'Source destination',
    example: '1234567890',
  })
  sourceDestination: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'IP of the client',
    example: '42.114.190.170',
  })
  ipAddress: string;
}
