import { AuthGuard } from '@nestjs/passport';

export class UniversalJwtAuthGuard extends AuthGuard('universal-jwt') {}
