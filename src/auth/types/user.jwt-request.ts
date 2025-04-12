export type UserJwtRequest = {
  isAdmin: false;
  userId: string;
  email: string;
  sourceIdList?: Array<string>;
};
