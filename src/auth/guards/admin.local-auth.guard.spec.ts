import { AdminLocalAuthGuard } from './admin.local-auth.guard';

describe('LocalAuthGuard', () => {
  it('should be defined', () => {
    expect(new AdminLocalAuthGuard()).toBeDefined();
  });
});
