import { JWTAuthGuard } from './jwt.guard';

describe('GuardGuard', () => {
  it('should be defined', () => {
    expect(new JWTAuthGuard()).toBeDefined();
  });
});
