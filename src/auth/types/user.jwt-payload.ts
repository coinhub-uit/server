export type UserJwtPayload = {
  sub: string;
  email: string;
} & Record<string, string>;
