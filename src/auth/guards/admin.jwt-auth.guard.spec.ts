import { AdminJwtAuthGuard } from './admin.jwt-auth.guard';

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    expect(new AdminJwtAuthGuard()).toBeDefined();
  });
});
