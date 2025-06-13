import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Decimal from 'decimal.js';
import { SettingDto } from 'src/setting/dtos/setting.dto';
import { SettingsEntity } from 'src/setting/entities/settings.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(SettingsEntity)
    private readonly settingsRepository: Repository<SettingsEntity>,
  ) {}

  async find() {
    return await this.settingsRepository.findOne({
      where: {
        id: true,
      },
    });
  }

  async partialUpdate(settingDto: SettingDto) {
    return await this.settingsRepository.save({
      id: true,
      minAmountOpenTicket: settingDto.minAmountOpenTicket
        ? Decimal(settingDto.minAmountOpenTicket)
        : undefined,
    });
  }
}
