import {
  RegisterUserInput,
  RegisterUserOutput,
} from '../../../dtos/auth/register-user.dto';

export const IRegisterUserUseCase = Symbol('IRegisterUserUseCase');

export interface IRegisterUserUseCase {
  execute(input: RegisterUserInput): Promise<RegisterUserOutput>;
}
