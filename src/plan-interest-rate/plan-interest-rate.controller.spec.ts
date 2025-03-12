import { Test, TestingModule } from '@nestjs/testing';
import { PlanInterestRateController } from './plan-interest-rate.controller';
import { PlanInterestRateService } from './plan-interest-rate.service';

describe('PlanInterestRateController', () => {
  let controller: PlanInterestRateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanInterestRateController],
      providers: [PlanInterestRateService],
    }).compile();

    controller = module.get<PlanInterestRateController>(
      PlanInterestRateController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
