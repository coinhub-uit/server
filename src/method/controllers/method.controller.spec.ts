import { Test, TestingModule } from '@nestjs/testing';
import { MethodController } from './method.controller';

describe('MethodController', () => {
  let controller: MethodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MethodController],
    }).compile();

    controller = module.get<MethodController>(MethodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
