import { Injectable } from '@nestjs/common';
import { SourceService } from 'src/source/services/source.service';
import { TranferMoneysDto } from '../dtos/transfer-money.dto';

@Injectable()
export class PaymentService {
  constructor(private readonly sourceService: SourceService) {}

  async tranferMoney(tranferMoneyDetails: TranferMoneysDto) {
    const minus = this.sourceService.changeSourceBalanceById(
      tranferMoneyDetails.fromSourceId,
      -tranferMoneyDetails.money,
    );
    const plus = this.sourceService.changeSourceBalanceById(
      tranferMoneyDetails.toSourceId,
      tranferMoneyDetails.money,
    );
    const result = await Promise.all([minus, plus]);
    if (result[0] === null || result[1] === null) {
      return null;
    }
  }
}
