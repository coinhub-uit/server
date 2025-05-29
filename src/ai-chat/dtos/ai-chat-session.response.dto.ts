import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema()
export class AiChatSessionResponseDto {
  @ApiProperty()
  role!: string;

  @ApiProperty()
  message!: string;
}
