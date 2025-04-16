import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePlanRequestDto } from 'src/plan/dtos/requests/create-plan.request.dto';
import { UpdatePlanRequestDto } from 'src/plan/dtos/requests/update-plan.request.dto';
import { CreatePlanResponseDto } from 'src/plan/dtos/responses/create-plan.response.dto';
import { UpdatePlanResponseDto } from 'src/plan/dtos/responses/update-plan.response.dto';
import { AvailablePlanEntity } from 'src/plan/entities/available-plan.entity';
import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import { PlanHistoryNotExist } from 'src/plan/exceptions/plan-history-not-exist';
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
      rate,
      plan,
    });
    const planHistoryEntity =
      await this.planHistoryRepository.save(planHistory);
    return planHistoryEntity;
  }

  // async findPlanHistoryById(planHistoryId: string) {
  //   const planHistoryEntity = await this.planHistoryRepository.findOne({
  //     where: { id: planHistoryId },
  //     relations: {
  //       plan: true,
  //     },
  //   });
  //   if (!planHistoryEntity) {
  //     throw new PlanHistoryNotExist();
  //   }
  //   return planHistoryEntity;
  // }

  async createPlan(createPlanDto: CreatePlanRequestDto) {
    const plan = this.planRepository.create({
      days: createPlanDto.days,
      isActive: true,
    });
    const planEntity = await this.planRepository.save(plan);
    const planHistory = await this.updatePlanHistory(createPlanDto.rate, plan);
    return {
      days: planEntity.days,
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
    const plan = await this.planRepository.findOne({
      where: { days: days, isActive: true },
    });

    if (!plan) {
      throw new PlanNotExist();
    }
    return [plan];
  }

  async findPlansByDaysWithHistory(days: number) {
    const plans = await this.planRepository.find({
      where: { days: days },
      relations: {
        planHistories: true,
      },
    });

    if (!plans) {
      throw new PlanNotExist();
    }
    return plans;
  }

  getAvailablePlans() {
    return this.availablePlanRepository.find();
  }

  getPlans(isActive: boolean) {
    return this.planRepository.findOneOrFail({
      where: { isActive },
    });
  }

  getPlanById(id: number) {
    return this.planRepository.findOneOrFail({ where: { id } });
  }

  getAll(days: number, isActive: boolean) {
    return this.planRepository.findBy({ days: days, isActive });
  }
}
