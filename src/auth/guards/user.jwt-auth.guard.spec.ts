import { UserJwtAuthGuard } from './user.jwt-auth.guard';

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    expect(new UserJwtAuthGuard()).toBeDefined();
  });
});
