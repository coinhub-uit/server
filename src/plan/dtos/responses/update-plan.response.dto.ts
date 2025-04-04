import { ApiSchema } from '@nestjs/swagger';
import { CreatePlanResponseDto } from 'src/plan/dtos/responses/create-plan.response.dto';

@ApiSchema()
export class UpdatePlanResponseDto extends CreatePlanResponseDto {}
