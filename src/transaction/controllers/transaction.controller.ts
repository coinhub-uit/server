import { Controller, Post, Get } from '@nestjs/common';
import { TransactionService } from 'src/transaction/services/transaction.service';
import { CreateVnPayDto } from 'src/transaction/utils/dtos/create-vnpay.dto';
import { CreateVnPayParams } from 'src/transaction/utils/types';
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

  @Get('vnpay-ipn')
  paymentCallBack() {
    return IpnSuccess;
  }
}
