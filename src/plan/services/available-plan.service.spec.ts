import { Test, TestingModule } from '@nestjs/testing';
import { AvailablePlanService } from './available-plan.service';

describe('AvailablePlanService', () => {
  let service: AvailablePlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvailablePlanService],
    }).compile();

    service = module.get<AvailablePlanService>(AvailablePlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
