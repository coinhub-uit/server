import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UniversalJwtAuthGuard } from 'src/auth/guards/universal.jwt-auth.guard';
import { SettingDto } from 'src/setting/dtos/setting.dto';
import { SettingsEntity } from 'src/setting/entities/settings.entity';
import { SettingService } from 'src/setting/services/setting.service';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Get settings',
  })
  @ApiOkResponse({
    type: SettingsEntity,
  })
  @Get()
  async get() {
    return await this.settingService.find();
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiOperation({
    summary: 'Partial update settings',
    description:
      "Partial update settings. 200 will be return even if no modification because yeah I don't want to handle this",
  })
  @ApiOkResponse({
    type: SettingsEntity,
  })
  @Patch()
  async update(@Body() settingDto: SettingDto) {
    return await this.settingService.partialUpdate(settingDto);
  }
}
