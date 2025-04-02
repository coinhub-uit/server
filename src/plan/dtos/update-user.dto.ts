import { ApiSchema } from '@nestjs/swagger';
import { CreatePlanDto } from 'src/plan/dtos/create-plan.dto';

@ApiSchema()
export class UpdatePlanDto extends CreatePlanDto {}
