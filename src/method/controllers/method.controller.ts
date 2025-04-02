import { Controller, Get, Param } from '@nestjs/common';
import { MethodService } from 'src/method/services/method.service';
import { MethodEntity } from '../entities/method.entity';

@Controller('methods')
export class MethodController {
  constructor(private methodService: MethodService) {}

  // TODO: validate the id parameter
  @Get(':id')
  getMethodById(@Param('id') id: MethodEntity['id']) {
    return this.methodService.getMethodById(id);
  }
}
