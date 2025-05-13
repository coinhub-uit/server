import { AvailablePlanEntity } from 'src/plan/entities/available-plan.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';
import { PlanNotExistException } from 'src/plan/exceptions/plan-not-exist';
import { Repository } from 'typeorm';
import { UpdatePlanRateDto } from 'src/plan/dtos/update-plan-rate.dto';
import { PlanHistoryNotExistException } from 'src/plan/exceptions/plan-history-not-exist';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(PlanEntity)
    private readonly planRepository: Repository<PlanEntity>,
    @InjectRepository(AvailablePlanEntity)
    private readonly availablePlanRepository: Repository<AvailablePlanEntity>,
    @InjectRepository(PlanHistoryEntity)
    private readonly planHistoryRepository: Repository<PlanHistoryEntity>,
  ) {}

  async findById(id: number, allHistories: boolean) {
    const planEntity = await this.planRepository.findOne({
      where: { id },
      relations: { planHistories: allHistories },
    });
    if (!planEntity) {
      throw new PlanNotExistException(id);
    }
  }

  async findHistoryById(id: number) {
    const planHistoryEntity = await this.planHistoryRepository.findOne({
      where: { id },
    });
    if (!planHistoryEntity) {
      throw new PlanHistoryNotExistException(id);
    }
  }

  async updateRate(updatePlanDto: UpdatePlanRateDto) {
    const plan = await this.planRepository.findOne({
      where: { id: updatePlanDto.planId },
    });
    if (!plan) {
      throw new PlanNotExistException(updatePlanDto.planId);
    }
    const planHistory = this.planHistoryRepository.create({
      rate: updatePlanDto.rate,
      plan,
    });
    return await this.planHistoryRepository.save(planHistory);
  }

  async getAvailablePlans() {
    return await this.availablePlanRepository.find();
  }

  async findAll() {
    return await this.planRepository.find();
  }
}
