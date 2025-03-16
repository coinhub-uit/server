export type CreateUserParams = {
  userId: string;
  userName: string;
  password: string;
  fullName: string;
  birthDay: string;
  pin: string;
  avatar?: Buffer;
  address?: string;
  email?: string;
  phoneNumber?: string;
};
