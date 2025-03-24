import { Controller, Get, Param } from '@nestjs/common';
import { MethodService } from 'src/method/services/method.service';

@Controller('method')
export class MethodController {
  constructor(private methodService: MethodService) {}

  @Get(':id')
  getMethodById(@Param('id') id: string) {
    return this.methodService.getMethodById(id);
  }
}
