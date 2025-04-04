import { ApiSchema } from '@nestjs/swagger';
import { CreatePlanRequestDto } from 'src/plan/dtos/requests/create-plan.request.dto';

@ApiSchema()
export class UpdatePlanRequestDto extends CreatePlanRequestDto {}
