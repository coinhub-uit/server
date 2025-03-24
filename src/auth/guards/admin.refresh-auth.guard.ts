import { AuthGuard } from '@nestjs/passport';

export class AdminRefreshJwtAuthGuard extends AuthGuard('admin-refresh-jwt') {}
