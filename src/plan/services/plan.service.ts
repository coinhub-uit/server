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

  getPlans(isDisabled: boolean) {
    return this.planRepository.findOneOrFail({
      where: { isDisabled: isDisabled },
    });
  }

  getPlanById(id: string) {
    return this.planRepository.findOneOrFail({ where: { id: id } });
  }

  getAll(days: number, isDisabled: boolean) {
    return this.planRepository.findBy({ days: days, isDisabled: isDisabled });
  }
}
