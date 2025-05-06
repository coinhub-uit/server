import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ApiSchema()
export class AiChatRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message!: string;
}
