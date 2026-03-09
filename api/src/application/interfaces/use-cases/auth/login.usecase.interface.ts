import { LoginInput, LoginOutput } from '../../../dtos/auth/login.dto';

export const ILoginUseCase = Symbol('ILoginUseCase');

export interface ILoginUseCase {
  execute(input: LoginInput): Promise<LoginOutput>;
}
