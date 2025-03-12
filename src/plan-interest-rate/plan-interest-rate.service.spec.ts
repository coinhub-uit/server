import { Test, TestingModule } from '@nestjs/testing';
import { PlanInterestRateService } from './plan-interest-rate.service';

describe('PlanInterestRateService', () => {
  let service: PlanInterestRateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanInterestRateService],
    }).compile();

    service = module.get<PlanInterestRateService>(PlanInterestRateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
