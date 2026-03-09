import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { ConflictError } from '../../errors/conflict.error';
import { IUserRepository } from '../../../domain/interfaces/repositories/user-repository.interface';
import { IIdGenerator } from '../../interfaces/services/id-generator.interface';
import { IPasswordHasher } from '../../interfaces/services/password-hasher.interface';
import {
  RegisterUserInput,
  RegisterUserOutput,
} from '../../dtos/auth/register-user.dto';
import { IRegisterUserUseCase } from '../../interfaces/use-cases/auth/register-user.usecase.interface';

@Injectable()
export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    @Inject(IUserRepository) private readonly users: IUserRepository,
    @Inject(IIdGenerator) private readonly ids: IIdGenerator,
    @Inject(IPasswordHasher) private readonly hasher: IPasswordHasher,
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const existing = await this.users.findByEmail(input.email.toLowerCase());
    if (existing) throw new ConflictError('Email already in use.');

    const passwordHash = await this.hasher.hash(input.password);
    const user = User.create({
      id: this.ids.newId(),
      email: input.email,
      passwordHash,
    });

    const saved = await this.users.save(user);
    return { user: { id: saved.id, email: saved.email } };
  }
}
