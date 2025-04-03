import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

@ApiSchema()
export class CreatePlanRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  days!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  rate!: number;
}
