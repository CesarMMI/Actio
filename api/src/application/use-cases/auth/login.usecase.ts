import { Inject, Injectable } from '@nestjs/common';
import { AuthenticationError } from '../../errors/authentication.error';
import { IUserRepository } from '../../../domain/interfaces/repositories/user-repository.interface';
import { IPasswordHasher } from '../../interfaces/services/password-hasher.interface';
import { ITokenService } from '../../interfaces/services/token-service.interface';
import { LoginInput, LoginOutput } from '../../dtos/auth/login.dto';
import { ILoginUseCase } from '../../interfaces/use-cases/auth/login.usecase.interface';

@Injectable()
export class LoginUseCase implements ILoginUseCase {
  constructor(
    @Inject(IUserRepository) private readonly users: IUserRepository,
    @Inject(IPasswordHasher) private readonly hasher: IPasswordHasher,
    @Inject(ITokenService) private readonly tokens: ITokenService,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.users.findByEmail(input.email.toLowerCase());
    if (!user) throw new AuthenticationError('Invalid credentials.');

    const ok = await this.hasher.verify(input.password, user.passwordHash);
    if (!ok) throw new AuthenticationError('Invalid credentials.');

    const accessToken = await this.tokens.signAccessToken({
      userId: user.id,
      email: user.email,
    });
    return { accessToken };
  }
}
