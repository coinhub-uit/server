import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema()
export class CreatePlanResponseDto {
  @ApiProperty()
  days!: number;

  @ApiProperty()
  rate!: number;
}
