import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreateVnPayDto } from 'src/payment/dtos/create-vnpay.dto';
import { VnpayService } from 'src/payment/services/vnpay.service';
import { ReturnQueryFromVNPay } from 'vnpay';

@Controller('payment/vnpay')
export class VnpayController {
  constructor(private paymentService: VnpayService) {}

  @Post('create')
  createPaymentVNPay(createVnPayDto: CreateVnPayDto) {
    return this.paymentService.createVNPayPayment(createVnPayDto);
  }

  @Get('vnpay-ipn')
  async paymentCallBack(@Req() req: Request) {
    return await this.paymentService.verifyIpn(
      req.query as ReturnQueryFromVNPay,
    );
  }
}
