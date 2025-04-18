import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

@ApiSchema()
export class UpdatePlanRateDto {
  @ApiProperty()
  @IsNumber()
  planId: number;

  @ApiProperty()
  @IsNumber()
  @Min(0.1)
  @Max(100)
  rate: number;
}
