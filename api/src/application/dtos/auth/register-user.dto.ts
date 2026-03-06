import { UserDto } from './user.dto';

export type RegisterUserInput = {
  email: string;
  password: string;
};

export type RegisterUserOutput = {
  user: UserDto;
};
