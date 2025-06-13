import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingController } from 'src/setting/controllers/setting.controller';
import { SettingsEntity } from 'src/setting/entities/settings.entity';
import { SettingService } from 'src/setting/services/setting.service';

@Module({
  imports: [TypeOrmModule.forFeature([SettingsEntity])],
  controllers: [SettingController],
  providers: [SettingService],
})
export class SettingModule {}
