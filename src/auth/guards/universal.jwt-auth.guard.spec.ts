import { UniversalJwtAuthGuard } from './universal.jwt-auth.guard';

describe('UniversalJwtAuthGuard', () => {
  it('should be defined', () => {
    expect(new UniversalJwtAuthGuard()).toBeDefined();
  });
});
