import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TopUpProviderEnum } from 'src/payment/types/top-up-provider.enum';

@ApiSchema()
export class CreateTopUpDto {
  @ApiProperty({
    enum: TopUpProviderEnum,
  })
  @IsNotEmpty()
  @IsEnum(TopUpProviderEnum)
  provider!: TopUpProviderEnum;

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
