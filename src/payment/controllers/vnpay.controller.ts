import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreateTopUpDto } from 'src/payment/dtos/create-top-up.dto';
import { TopUpService } from 'src/payment/services/top-up.service';
import { ReturnQueryFromVNPay } from 'vnpay';

@Controller('payment/vnpay')
export class VnpayController {
  constructor(private topUpService: TopUpService) {}

  @Post('create')
  async createPaymentVNPay(@Body() createVnPayDto: CreateTopUpDto) {
    return await this.topUpService.createVNPayPayment(createVnPayDto);
  }

  @Get('vnpay-ipn')
  async paymentCallBack(@Req() req: Request) {
    return await this.topUpService.verifyIpn(req.query as ReturnQueryFromVNPay);
  }
}
