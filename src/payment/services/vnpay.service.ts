import { Injectable } from '@nestjs/common';
import { VnpayService as _VnpayService } from 'nestjs-vnpay';
import {
  dateFormat,
  IpnFailChecksum,
  IpnInvalidAmount,
  IpnOrderNotFound,
  IpnSuccess,
  IpnUnknownError,
  ProductCode,
  ReturnQueryFromVNPay,
  VnpLocale,
} from 'vnpay';
import { CreateVnPayDto } from '../dtos/create-vnpay.dto';
import { generateTxnRef } from 'src/common/utils/generate-txn-ref';
import { SourceService } from 'src/source/services/source.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from 'src/payment/entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VnpayService {
  constructor(
    private readonly sourceService: SourceService,
    private readonly vnpayService: _VnpayService,
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  getBankList() {
    return this.vnpayService.getBankList();
  }

  async verifyIpn(query: ReturnQueryFromVNPay) {
    const verification = await this.vnpayService.verifyIpnCall(query);
    if (!verification.isVerified) {
      return IpnFailChecksum;
    }
    if (!verification.isSuccess) {
      return IpnUnknownError;
    }
    const foundOrder = await this.transactionRepository.findOne({
      where: { txnRef: verification.vnp_TxnRef },
    });
    if (!foundOrder || verification.vnp_TxnRef !== foundOrder.txnRef) {
      return IpnOrderNotFound;
    }
    if (verification.vnp_Amount !== foundOrder.amount) {
      return IpnInvalidAmount;
    }
    await this.sourceService.changeBalanceSource(
      foundOrder.amount,
      foundOrder.sourceDestination,
    );
    foundOrder.isPaid = true;
    return IpnSuccess;
  }

  createVNPayPayment(paymentDetails: CreateVnPayDto) {
    const txnRef = generateTxnRef();
    this.transactionRepository.create({
      amount: paymentDetails.amount,
      sourceDestination: paymentDetails.orderInfo,
      txnRef,
      isPaid: false,
    });

    return this.vnpayService.buildPaymentUrl({
      vnp_ReturnUrl: paymentDetails.returnUrl,
      vnp_Amount: paymentDetails.amount,
      vnp_IpAddr: paymentDetails.ipAddr,
      vnp_OrderInfo: paymentDetails.orderInfo,
      vnp_TxnRef: txnRef,
      vnp_OrderType: ProductCode.Pay,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(new Date()),
    });
  }
}
