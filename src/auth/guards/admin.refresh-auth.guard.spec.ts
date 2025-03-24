import { AdminRefreshJwtAuthGuard } from './admin.refresh-auth.guard';

describe('RefreshAuthGuard', () => {
  it('should be defined', () => {
    expect(new AdminRefreshJwtAuthGuard()).toBeDefined();
  });
});
