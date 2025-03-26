import { Controller, Post } from '@nestjs/common';
import { TranferMoneysDto } from 'src/payment/dtos/transfer-money.dto';
import { PaymentService } from 'src/payment/services/payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('tranfer-money')
  tranferMoney(tranferMoneyDto: TranferMoneysDto) {
    return this.paymentService.tranferMoney(tranferMoneyDto);
  }
}
