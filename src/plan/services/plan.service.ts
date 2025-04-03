import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePlanRequestDto } from 'src/plan/dtos/requests/create-plan.request.dto';
import { UpdatePlanRequestDto } from 'src/plan/dtos/requests/update-plan.request.dto';
import { CreatePlanResponseDto } from 'src/plan/dtos/responses/create-plan.response.dto';
import { UpdatePlanResponseDto } from 'src/plan/dtos/responses/update-plan.response.dto';
import { AvailablePlanEntity } from 'src/plan/entities/available-plan.entity';
import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import { PlanAlreadyExist } from 'src/plan/exceptions/plan-already-exist';
import { PlanNotExist } from 'src/plan/exceptions/plan-not-exist';
import { Repository } from 'typeorm';

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

  private async updatePlanHistory(rate: number, plan: PlanEntity) {
    const planHistory = this.planHistoryRepository.create({
      rate: rate,
      definedDate: new Date(),
      plan: Promise.resolve(plan),
    });
    const insertResult = await this.planHistoryRepository.insert(planHistory);
    return insertResult.generatedMaps[0] as PlanHistoryEntity;
  }

  async createPlan(createPlanDto: CreatePlanRequestDto) {
    const plan = this.planRepository.create({
      days: createPlanDto.days,
      isActive: true,
    });
    const insertResult = await this.planRepository.insert(plan);
    if (insertResult.identifiers.length === 0) {
      throw new PlanAlreadyExist();
    }
    const planHistory = await this.updatePlanHistory(createPlanDto.rate, plan);
    return {
      days: (insertResult.generatedMaps[0] as PlanEntity).days,
      rate: planHistory.rate,
    } as CreatePlanResponseDto;
  }

  async updatePlan(updatePlanDto: UpdatePlanRequestDto, plan: PlanEntity) {
    const updatedPlan = (
      await this.planRepository.update(updatePlanDto.days, plan)
    ).generatedMaps[0] as PlanEntity;
    const planHistory = await this.updatePlanHistory(
      updatePlanDto.rate,
      updatedPlan,
    );
    return {
      days: updatedPlan.days,
      rate: planHistory.rate,
    } as UpdatePlanResponseDto;
  }

  async findPlanByDays(days: number) {
    const plan = await this.planRepository.findOne({ where: { days: days } });
    if (!plan) {
      throw new PlanNotExist();
    }
    return plan;
  }

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
