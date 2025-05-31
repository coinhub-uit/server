import {
  Body,
  Controller,
  Get,
  NotFoundException,
  NotImplementedException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiNotImplementedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Request } from 'express';
import { UniversalJwtAuthGuard } from 'src/auth/guards/universal.jwt-auth.guard';
import { UserJwtAuthGuard } from 'src/auth/guards/user.jwt-auth.guard';
import { CreateTopUpDto } from 'src/payment/dtos/create-top-up.dto';
import { CreateTopUpResponseDto } from 'src/payment/dtos/create-top-up.response.dto';
import { TranferMoneyDto } from 'src/payment/dtos/transfer-money.dto';
import { TransferFromSourceNotExistsException } from 'src/payment/exceptions/transfer-from-source-not-exist.exception';
import { TransferToSourceNotExistsException } from 'src/payment/exceptions/transfer-to-source-not-exist.exception';
import { PaymentService } from 'src/payment/services/payment.service';
import { VnpayService } from 'src/payment/services/vnpay.service';
import { TopUpProviderEnum } from 'src/payment/types/top-up-provider.enum';
import { ReturnQueryFromVNPay } from 'vnpay';

@Controller('payment')
export class PaymentController {
  constructor(
    private paymentService: PaymentService,
    private vnpayService: VnpayService,
  ) {}

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Transfer money',
    description: 'Transfer money from source to source',
  })
  @ApiNotFoundResponse({
    description: 'Either from source or to source or both do not exist',
  })
  @ApiCreatedResponse()
  @Post('tranfer')
  async tranferMoney(@Body() tranferMoneyDto: TranferMoneyDto) {
    try {
      await this.paymentService.tranferMoney(tranferMoneyDto);
    } catch (error) {
      if (
        error instanceof TransferFromSourceNotExistsException ||
        error instanceof TransferToSourceNotExistsException
      ) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Generate top up link',
    description: 'Generate top up link',
  })
  @ApiCreatedResponse({
    description: 'Top up link',
    example: {
      url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=1806000&vnp_Command=pay&vnp_CreateDate=20210801153333&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+%3A5&vnp_OrderType=other&vnp_ReturnUrl=https%3A%2F%2Fdomainmerchant.vn%2FReturnUrl&vnp_TmnCode=DEMOV210&vnp_TxnRef=5&vnp_Version=2.1.0&vnp_SecureHash=3e0d61a0c0534b2e36680b3f7277743e8784cc4e1d68fa7d276e79c23be7d6318d338b477910a27992f5057bb1582bd44bd82ae8009ffaf6d141219218625c42',
    } satisfies CreateTopUpResponseDto,
    type: CreateTopUpResponseDto,
  })
  @ApiNotImplementedResponse()
  @UseGuards(UserJwtAuthGuard)
  @Post('top-up')
  async create(
    @Body() createTopUpDto: CreateTopUpDto,
  ): Promise<CreateTopUpResponseDto> {
    switch (createTopUpDto.provider) {
      case TopUpProviderEnum.vnpay:
        return await this.vnpayService.createVNPayTopUp(createTopUpDto);
      case TopUpProviderEnum.zalopay:
        throw new NotImplementedException(
          "Top up provider zalopay hasn't been implemented yet",
        );
      case TopUpProviderEnum.momo:
        throw new NotImplementedException(
          "Top up provider mono hasn't been implemented yet",
        );
    }
  }

  @ApiOperation({
    summary: 'IPN URL for VNPAY',
    description: 'This is for VNPay to callback, not for the user / admin.',
  })
  @Get('top-up/vnpay-ipn')
  async ipnCallback(@Req() req: Request) {
    return await this.vnpayService.verifyIpn(req.query as ReturnQueryFromVNPay);
  }
}
