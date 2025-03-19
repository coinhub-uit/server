import { Controller, Post, Get } from '@nestjs/common';
import { TransactionService } from 'src/transaction/services/transaction.service';
import {
  CreateVnPayDto,
  TranferMoneysDto,
} from 'src/transaction/utils/dtos/create-vnpay.dto';
import {
  CreateVnPayParams,
  TranferMoneysParams,
} from 'src/transaction/utils/types';
import { IpnSuccess } from 'vnpay';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get('bank')
  getBankList() {
    return this.transactionService.getBankList();
  }

  @Post('vnpay')
  createPaymentVNPay(createVnPayDto: CreateVnPayDto) {
    const paymentDetails: CreateVnPayParams = { ...createVnPayDto };
    return this.transactionService.createVNPayPayment(paymentDetails);
  }

  @Post('tranfermoney')
  tranferMoney(tranferMoneyDto: TranferMoneysDto) {
    const tranferMoneyDetails: TranferMoneysParams = tranferMoneyDto;
    return this.transactionService.tranferMoney(tranferMoneyDetails);
  }
  @Get('vnpay-ipn')
  paymentCallBack() {
    return IpnSuccess;
  }
}
