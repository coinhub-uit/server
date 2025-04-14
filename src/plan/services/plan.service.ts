import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatePlanRateDto } from 'src/plan/dtos/update-plan-rate.dto';
import { AvailablePlanEntity } from 'src/plan/entities/available-plan.entity';
import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import { PlanNotExistException as PlanNotExistException } from 'src/plan/exceptions/plan-not-exist';
import { QueryFailedError, Repository } from 'typeorm';
import { PlanHistoryNotExistException as PlanHistoryNotExistException } from 'src/plan/exceptions/plan-history-not-exist';

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
    try {
      return await this.planRepository.findOneOrFail({
        where: { id },
        relations: { planHistories: allHistories },
      });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new PlanNotExistException(id);
      }
      throw error;
    }
  }

  async findHistoryById(id: number) {
    try {
      return await this.planHistoryRepository.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new PlanHistoryNotExistException(id);
      }
      throw error;
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
