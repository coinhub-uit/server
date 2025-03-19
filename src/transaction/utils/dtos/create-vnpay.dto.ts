import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

class CreateVnPayDto {
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

class TranferMoneysDto {
  @IsNotEmpty()
  @IsString()
  fromSourceId: string;

  @IsNotEmpty()
  @IsString()
  toSourceId: string;

  @IsNotEmpty()
  @IsNumber()
  money: number;

  @IsDate()
  createAt: Date;
}

export { CreateVnPayDto, TranferMoneysDto };
