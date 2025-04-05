import { Controller, Get, Param } from '@nestjs/common';
import { MethodService } from 'src/method/services/method.service';
import { MethodEnum } from 'src/method/types/method.enum';

@Controller('methods')
export class MethodController {
  constructor(private methodService: MethodService) {}

  // TODO: Docs for this, show that all method we have. Downside is we can only show that the params is the string
  @Get(':id')
  getMethodById(@Param('id') id: string) {
    // HACK: validate the id parameter, convert to enum more "gentle"? Not this
    return this.methodService.getMethodById(
      MethodEnum[id as keyof typeof MethodEnum],
    );
  }
}
