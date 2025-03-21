import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { TransactionService } from 'src/transaction/services/transaction.service';
import {
  CreateVnPayDto,
  TranferMoneysDto,
} from 'src/transaction/utils/dtos/create-vnpay.dto';
import {
  CreateVnPayParams,
  TranferMoneysParams,
} from 'src/transaction/utils/types';
import { LocalAuthGuard } from 'src/user/auth/guard/local-auth/local-auth.guard';
import { IpnSuccess } from 'vnpay';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @UseGuards(LocalAuthGuard)
  @Get('bank')
  getBankList() {
    return this.transactionService.getBankList();
  }

  @UseGuards(LocalAuthGuard)
  @Post('vnpay')
  createPaymentVNPay(createVnPayDto: CreateVnPayDto) {
    const paymentDetails: CreateVnPayParams = { ...createVnPayDto };
    return this.transactionService.createVNPayPayment(paymentDetails);
  }

  @UseGuards(LocalAuthGuard)
  @Post('tranfermoney')
  tranferMoney(tranferMoneyDto: TranferMoneysDto) {
    const tranferMoneyDetails: TranferMoneysParams = tranferMoneyDto;
    return this.transactionService.tranferMoney(tranferMoneyDetails);
  }

  @UseGuards(LocalAuthGuard)
  @Get('vnpay-ipn')
  paymentCallBack() {
    return IpnSuccess;
  }
}
