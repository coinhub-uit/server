import { JwtJwtAuthGuard } from './admin.jwt-auth.guard';

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    expect(new JwtJwtAuthGuard()).toBeDefined();
  });
});
