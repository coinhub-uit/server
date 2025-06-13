import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UniversalJwtAuthGuard } from 'src/auth/guards/universal.jwt-auth.guard';
import { SettingDto } from 'src/setting/dtos/setting.dto';
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
  @Get()
  async get() {
    return await this.settingService.find();
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiOperation({
    summary: 'Partial update settings',
  })
  @Patch()
  async update(@Body() settingDto: SettingDto) {
    return await this.settingService.partialUpdate(settingDto);
  }
}
