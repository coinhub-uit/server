import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { AbstractResponseDto } from 'src/common/dto/abstract.response.dto';

@ApiSchema()
export class AiChatResponseDto extends AbstractResponseDto<AiChatResponseDto> {
  @ApiProperty()
  message!: string | null;
}
