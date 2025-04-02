import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AvailablePlanEntity } from 'src/plan/entities/available-plan.entity';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(PlanEntity)
    private readonly planRepository: Repository<PlanEntity>,
    @InjectRepository(AvailablePlanEntity)
    private readonly availablePlanRepository: Repository<AvailablePlanEntity>,
  ) {}

  getAvailablePlans() {
    return this.availablePlanRepository.find();
  }
  getPlans(isActive: boolean) {
    return this.planRepository.findOneOrFail({
      where: { isActive },
    });
  }

  getPlanById(id: string) {
    return this.planRepository.findOneOrFail({ where: { id: id } });
  }

  getAll(days: number, isActive: boolean) {
    return this.planRepository.findBy({ days: days, isActive });
  }
}
