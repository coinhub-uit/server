import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(PlanEntity)
    private readonly planRepository: Repository<PlanEntity>,
  ) {}

  getPlans(isActive: boolean) {
    return this.planRepository.findOneOrFail({
      where: { isActive },
    });
  }

  getPlanById(id: string) {
    return this.planRepository.findOneOrFail({ where: { id: id } });
  }

  getAll(days: number, isDisabled: boolean) {
    return this.planRepository.findBy({ days: days, isDisabled: isDisabled });
  }
}
