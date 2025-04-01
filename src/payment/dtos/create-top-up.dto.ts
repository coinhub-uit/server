import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TopUpEnum } from 'src/payment/types/top-up.enum';

@ApiSchema()
export class CreateTopUpDto {
  @ApiProperty({
    enum: TopUpEnum,
  })
  @IsNotEmpty()
  @IsEnum(TopUpEnum)
  type!: TopUpEnum;

  @ApiProperty({
    description: 'Return URL to client app',
    example: 'coinhub://home',
  })
  @IsNotEmpty()
  @IsString()
  returnUrl!: string;

  @ApiProperty({
    description: 'The amount of money',
    example: 100000,
  })
  @IsNotEmpty()
  @IsNumber()
  amount!: number;

  @ApiProperty()
  @IsNotEmpty()
  sourceDestination!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  ipAddress!: string;
}
