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
import { SourceService } from 'src/source/services/source.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TopUpEntity } from 'src/payment/entities/top-up.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreateTopUpDto } from 'src/payment/dtos/create-top-up.dto';
import { TopUpProviderEnum } from 'src/payment/types/top-up-provider.enum';
import Decimal from 'decimal.js';
import { TopUpStatusEnum } from 'src/payment/types/top-up-status.enum';
import { CreateTopUpResponseDto } from 'src/payment/dtos/create-top-up.response.dto';
import { SourceEntity } from 'src/source/entities/source.entity';
import { SourceNotExistException } from 'src/source/exceptions/source-not-exist.execeptions';

// TODO: Cron? for checking topup status to overdue later
@Injectable()
export class VnpayService {
  constructor(
    private readonly sourceService: SourceService,
    private readonly vnpayService: _VnpayService,
    @InjectRepository(SourceEntity)
    private readonly sourceRepository: Repository<SourceEntity>,
    @InjectRepository(TopUpEntity)
    private readonly topUpRepository: Repository<TopUpEntity>,
    private dataSource: DataSource,
  ) {}

  async verifyIpn(query: ReturnQueryFromVNPay) {
    await this.dataSource.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const topUpRepository =
          transactionalEntityManager.getRepository(TopUpEntity);
        const verification = await this.vnpayService.verifyIpnCall(query);
        if (!verification.isVerified) {
          return IpnFailChecksum;
        }
        if (!verification.isSuccess) {
          return IpnUnknownError;
        }
        const topUp = await topUpRepository.findOne({
          where: { id: verification.vnp_TxnRef },
          relations: { sourceDestination: true },
        });
        if (!topUp) {
          return IpnOrderNotFound;
        }
        if (!topUp.amount.eq(verification.vnp_Amount)) {
          topUp.status = TopUpStatusEnum.declined;
          await topUpRepository.save(topUp);
          return IpnInvalidAmount;
        }
        topUp.status = TopUpStatusEnum.success;

        const sourceDestination = topUp.sourceDestination;
        await this.sourceService.changeSourceBalance(
          sourceDestination!,
          topUp.amount,
        );

        await topUpRepository.save(topUp);
        return IpnSuccess;
      },
    );
  }

  async createVNPayTopUp(createTopUpDto: CreateTopUpDto) {
    if (
      (await this.sourceRepository.findOne({
        where: {
          id: createTopUpDto.sourceDestinationId,
        },
      })) == null
    ) {
      throw new SourceNotExistException(createTopUpDto.sourceDestinationId);
    }
    const now = new Date();
    const topUp = this.topUpRepository.create({
      provider: TopUpProviderEnum.vnpay,
      amount: new Decimal(createTopUpDto.amount),
      sourceDestination: {
        id: createTopUpDto.sourceDestinationId,
      },
    });

    const topUpEntity = await this.topUpRepository.save(topUp);

    const url = this.vnpayService.buildPaymentUrl({
      vnp_ReturnUrl: createTopUpDto.returnUrl,
      vnp_Amount: createTopUpDto.amount,
      vnp_IpAddr: createTopUpDto.ipAddress,
      vnp_OrderInfo: `Top up ${createTopUpDto.amount} VND`,
      vnp_TxnRef: topUpEntity.id,
      vnp_OrderType: ProductCode.Pay,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(now),
      vnp_ExpireDate: dateFormat(
        new Date(new Date(now).setMinutes(now.getMinutes() + 15)),
      ),
    });

    // TODO: refactor this if constructor if have time
    const createTopUpResponseDto = new CreateTopUpResponseDto();
    createTopUpResponseDto.url = url;
    createTopUpResponseDto.topUpId = topUpEntity.id;
    return createTopUpResponseDto;
  }
}
