import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateVnPayDto {
  @IsNotEmpty()
  @IsString()
  returnUrl: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  ipAddr: string;

  @IsString()
  orderInfo: string;
}
