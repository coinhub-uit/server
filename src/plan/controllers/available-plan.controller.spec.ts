import { Test, TestingModule } from '@nestjs/testing';
import { AvailablePlanController } from './available-plan.controller';

describe('AvailablePlanController', () => {
  let controller: AvailablePlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvailablePlanController],
    }).compile();

    controller = module.get<AvailablePlanController>(AvailablePlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
