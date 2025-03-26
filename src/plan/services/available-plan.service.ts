import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AvailablePlanEntity } from 'src/plan/entities/available_plan.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AvailablePlanService {
  constructor(
    @InjectRepository(AvailablePlanEntity)
    private readonly availablePlanRepository: Repository<AvailablePlanEntity>,
  ) {}

  getAvailablePlans() {
    return this.availablePlanRepository.find();
  }
}
