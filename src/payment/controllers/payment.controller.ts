import { Controller, Post, Get } from '@nestjs/common';
import { PaymentService } from 'src/payment/services/payment.service';
import { CreateVnpayDto } from 'src/payment/dtos/create-vnpay.dto';
import { IpnSuccess } from 'vnpay';
import { TranferMoneysDto } from '../dtos/transfer-money.dto';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('vnpay')
  createPaymentVNPay(createVnPayDto: CreateVnpayDto) {
    return this.paymentService.createVNPayPayment(createVnPayDto);
  }

  @Post('tranfer-money')
  tranferMoney(tranferMoneyDto: TranferMoneysDto) {
    return this.paymentService.tranferMoney(tranferMoneyDto);
  }

  @Get('vnpay-ipn')
  paymentCallBack() {
    return IpnSuccess;
  }
}
