import { AuthGuard } from '@nestjs/passport';

export class JwtJwtAuthGuard extends AuthGuard('admin-jwt') {}
