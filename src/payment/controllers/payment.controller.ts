import {
  Body,
  Controller,
  Get,
  NotFoundException,
  NotImplementedException,
  Param,
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
import { TopUpEntity } from 'src/payment/entities/top-up.entity';
import { TopUpNotExistException } from 'src/payment/exceptions/top_up-not-exist';
import { TransferFromSourceNotExistsException } from 'src/payment/exceptions/transfer-from-source-not-exist.exception';
import { TransferToSourceNotExistsException } from 'src/payment/exceptions/transfer-to-source-not-exist.exception';
import { PaymentService } from 'src/payment/services/payment.service';
import { VnpayService } from 'src/payment/services/vnpay.service';
import { TopUpProviderEnum } from 'src/payment/types/top-up-provider.enum';
import { SourceNotExistException } from 'src/source/exceptions/source-not-exist.execeptions';
import { ReturnQueryFromVNPay } from 'vnpay';

@Controller('payment')
export class PaymentController {
  constructor(
    private paymentService: PaymentService,
    private vnpayService: VnpayService,
  ) {}

  @ApiOperation({
    summary: 'IPN URL for VNPAY',
    description: 'This is for VNPay to callback, not for the user / admin.',
  })
  @Get('top-up/vnpay-ipn')
  async ipnCallback(@Req() req: Request) {
    return await this.vnpayService.verifyIpn(req.query as ReturnQueryFromVNPay);
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Get Top Up By Id',
  })
  @ApiCreatedResponse({
    description: 'Top up entity',
    type: TopUpEntity,
  })
  @ApiNotFoundResponse({})
  @ApiCreatedResponse()
  @Get('top-up/:id')
  async getTopUpById(@Param('id') topUpId: string) {
    try {
      return this.paymentService.getTopUpById(topUpId);
    } catch (error) {
      if (error instanceof TopUpNotExistException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

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
    type: CreateTopUpResponseDto,
  })
  @ApiNotFoundResponse()
  @ApiNotImplementedResponse()
  @UseGuards(UserJwtAuthGuard)
  @Post('top-up')
  async create(
    @Body() createTopUpDto: CreateTopUpDto,
  ): Promise<CreateTopUpResponseDto> {
    try {
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
    } catch (error) {
      if (error instanceof SourceNotExistException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
