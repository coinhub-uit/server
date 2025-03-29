import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { UserJwtAuthGuard } from 'src/auth/guards/user.jwt-auth.guard';
import { CreateTopUpDto } from 'src/payment/dtos/create-top-up.dto';
import { TopUpService } from 'src/payment/services/top-up.service';
import { ReturnQueryFromVNPay } from 'vnpay';

@Controller('payment/vnpay')
export class VnpayController {
  constructor(private topUpService: TopUpService) {}

  @ApiBearerAuth()
  @UseGuards(UserJwtAuthGuard)
  @ApiOperation({
    summary: 'Generate payment link',
    description: 'Generate payment link for VNPay',
  })
  @ApiOkResponse({
    description: 'VNPAY payment link',
    example:
      'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=1806000&vnp_Command=pay&vnp_CreateDate=20210801153333&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+%3A5&vnp_OrderType=other&vnp_ReturnUrl=https%3A%2F%2Fdomainmerchant.vn%2FReturnUrl&vnp_TmnCode=DEMOV210&vnp_TxnRef=5&vnp_Version=2.1.0&vnp_SecureHash=3e0d61a0c0534b2e36680b3f7277743e8784cc4e1d68fa7d276e79c23be7d6318d338b477910a27992f5057bb1582bd44bd82ae8009ffaf6d141219218625c42' satisfies Awaited<
        ReturnType<VnpayController['create']>
      >,
  })
  @Post('create')
  async create(@Body() createVnPayDto: CreateTopUpDto) {
    return await this.topUpService.createVNPayPayment(createVnPayDto);
  }

  @ApiOperation({
    summary: 'IPN URL for VNPay',
    description: 'This is for VNPay to callback, not for the user / admin.',
  })
  @Get('vnpay-ipn')
  async ipnCallback(@Req() req: Request) {
    return await this.topUpService.verifyIpn(req.query as ReturnQueryFromVNPay);
  }
}
