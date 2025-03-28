import { AdminJwtRequest } from 'src/auth/types/admin.jwt-request';
import { UserJwtRequest } from 'src/auth/types/user.jwt-request';

export type UniversalJwtRequest = AdminJwtRequest | UserJwtRequest;
