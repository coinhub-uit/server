import { Injectable } from '@nestjs/common';
import { SourceService } from 'src/source/services/source.service';
import { TranferMoneysDto } from '../dtos/transfer-money.dto';
import Decimal from 'decimal.js';
@Injectable()
export class PaymentService {
  constructor(private readonly sourceService: SourceService) {}

  async tranferMoney(tranferMoneyDetails: TranferMoneysDto) {
    await this.sourceService.changeBalanceSource(
      new Decimal(-tranferMoneyDetails.money),
      tranferMoneyDetails.fromSourceId,
    );
    await this.sourceService.changeBalanceSource(
      new Decimal(tranferMoneyDetails.money),
      tranferMoneyDetails.toSourceId,
    );
    return 'Successful';
  }
}
