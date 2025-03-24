import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateVnPayDto {
  @IsNotEmpty()
  @IsString()
  vnp_ReturnUrl: string;

  @IsNotEmpty()
  @IsNumber()
  vnp_Amount: number;

  @IsNotEmpty()
  @IsString()
  vnp_IpAddr: string;

  @IsString()
  @IsNotEmpty()
  vnp_TxnRef: string;

  @IsString()
  vnp_OrderInfo: string;
}
