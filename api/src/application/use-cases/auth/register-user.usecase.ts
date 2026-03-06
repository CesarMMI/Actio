import { User } from '../../../domain/entities/user.entity';
import { ConflictError } from '../../errors/conflict.error';
import { IUserRepository } from '../../../domain/interfaces/repositories/user-repository.interface';
import { IIdGenerator } from '../../interfaces/services/id-generator.interface';
import { IPasswordHasher } from '../../interfaces/services/password-hasher.interface';
import {
  RegisterUserInput,
  RegisterUserOutput,
} from '../../dtos/auth/register-user.dto';

export class RegisterUserUseCase {
  constructor(
    private readonly users: IUserRepository,
    private readonly ids: IIdGenerator,
    private readonly hasher: IPasswordHasher,
  ) { }

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const existing = await this.users.findByEmail(input.email.toLowerCase());
    if (existing) throw new ConflictError('Email already in use.');

    const passwordHash = await this.hasher.hash(input.password);
    const user = User.create({ id: this.ids.newId(), email: input.email, passwordHash });

    const saved = await this.users.save(user);
    return { user: { id: saved.id, email: saved.email } };
  }
}
