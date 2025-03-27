import { Test, TestingModule } from '@nestjs/testing';
import { TopUpService } from './top-up.service';

describe('TopUpService', () => {
  let service: TopUpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopUpService],
    }).compile();

    service = module.get<TopUpService>(TopUpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
