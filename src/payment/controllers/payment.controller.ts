import { Controller, Post, Get, Req } from '@nestjs/common';
import { PaymentService } from 'src/payment/services/payment.service';
import { CreateVnpayDto } from 'src/payment/dtos/create-vnpay.dto';
import { ReturnQueryFromVNPay } from 'vnpay';
import { TranferMoneysDto } from '../dtos/transfer-money.dto';
import { Request } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('vnpay')
  createPaymentVNPay(createVnpayDto: CreateVnpayDto) {
    return this.paymentService.createVNPayPayment(createVnpayDto);
  }

  @Post('vnpay-transaction')
  createVnpayTransaction() {
    return this.paymentService;
  }
  @Post('tranfer-money')
  tranferMoney(tranferMoneyDto: TranferMoneysDto) {
    return this.paymentService.tranferMoney(tranferMoneyDto);
  }

  @Get('vnpay-ipn')
  async paymentCallBack(@Req() req: Request) {
    return await this.paymentService.verifyIpn(
      req.query as ReturnQueryFromVNPay,
    );
  }
}
