import { Controller, Get } from '@nestjs/common';

@Controller()
export class RootController {
  @Get()
  root(): string {
    return 'Made by NTNGuyen and KevinNitro';
  }
}
