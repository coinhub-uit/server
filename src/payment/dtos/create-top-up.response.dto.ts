import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema()
export class CreateTopUpResponseDto {
  @ApiProperty()
  url!: string;
}
