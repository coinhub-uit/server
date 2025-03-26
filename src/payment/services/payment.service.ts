import { Injectable } from '@nestjs/common';
import { VnpayService } from 'nestjs-vnpay';
import { SourceService } from 'src/source/services/source.service';
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
import { TranferMoneysDto } from '../dtos/transfer-money.dto';
import { CreateVnPayDto } from '../dtos/create-vnpay.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VnpayTransactionEntity } from 'src/payment/entities/vnpay-transaction.entity';
import { CreateVnpayTransactionDto } from 'src/payment/dtos/create-transaction.dto';
import { generateTxnRef } from 'src/common/utils/generate_txn_ref';

@Injectable()
export class PaymentService {
  constructor(
    private readonly sourceService: SourceService,
    private readonly vnpayService: VnpayService,
    @InjectRepository(VnpayTransactionEntity)
    private readonly vnpayTransactionRepository: Repository<VnpayTransactionEntity>,
  ) {}

  getBankList() {
    return this.vnpayService.getBankList();
  }

  async tranferMoney(tranferMoneyDetails: TranferMoneysDto) {
    await this.sourceService.changeBalanceSource(
      -tranferMoneyDetails.money,
      tranferMoneyDetails.fromSourceId,
    );
    await this.sourceService.changeBalanceSource(
      +tranferMoneyDetails.money,
      tranferMoneyDetails.toSourceId,
    );
    return 'Successful';
  }

  async createVnpayTransaction(
    vnpayTransactionDetails: CreateVnpayTransactionDto,
  ) {
    const vnpayTransaction = this.vnpayTransactionRepository.create({
      ...vnpayTransactionDetails,
      txnRef: generateTxnRef(),
    });
    await this.sourceService.changeBalanceSource(
      vnpayTransactionDetails.amount,
      vnpayTransactionDetails.sourceDestination,
    );
    return this.vnpayTransactionRepository.save(vnpayTransaction);
  }

  async verifyIpn(query: ReturnQueryFromVNPay) {
    const verification = await this.vnpayService.verifyIpnCall(query);
    if (!verification.isVerified) {
      return IpnFailChecksum;
    }
    if (!verification.isSuccess) {
      return IpnUnknownError;
    }
    const foundOrder = await this.vnpayTransactionRepository.findOneOrFail({
      where: { txnRef: verification.vnp_TxnRef },
    });
    if (!foundOrder || verification.vnp_TxnRef !== foundOrder.txnRef) {
      return IpnOrderNotFound;
    }
    if (verification.vnp_Amount !== foundOrder.amount) {
      return IpnInvalidAmount;
    }
    foundOrder.isPaid = true;
    return IpnSuccess;
  }

  createVNPayPayment(paymentDetails: CreateVnPayDto) {
    return this.vnpayService.buildPaymentUrl({
      ...paymentDetails,
      vnp_OrderType: ProductCode.Pay,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(new Date()),
    });
  }
}
