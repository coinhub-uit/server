import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VnpayService } from 'nestjs-vnpay';
import { TransactionEntity } from 'src/transaction/entities/transaction.entity';
import { CreateVnPayParams } from 'src/transaction/utils/types';
import { dateFormat, ProductCode, VnpLocale } from 'vnpay';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionService: TransactionService,
    private readonly vnpayService: VnpayService,
  ) {}

  getBankList() {
    return this.vnpayService.getBankList();
  }

  createVNPayPayment(paymentDetails: CreateVnPayParams) {
    return this.vnpayService.buildPaymentUrl({
      ...paymentDetails,
      vnp_OrderType: ProductCode.Pay,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(new Date()),
    });
  }
}
