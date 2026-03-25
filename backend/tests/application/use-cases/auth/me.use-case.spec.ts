import { MeUseCase } from '../../../../src/application/use-cases/auth/me.use-case';
import { UserNotFoundError } from '../../../../src/domain/errors/auth/user-not-found.error';
import { User } from '../../../../src/domain/entities/user/user.entity';
import { Email } from '../../../../src/domain/value-objects/email/email.value-object';
import { InMemoryUserRepository } from '../../mocks/in-memory-user.repository';

describe('UC-A04 — Get Current User', () => {
  let useCase: MeUseCase;
  let userRepo: InMemoryUserRepository;
  let savedUser: User;

  beforeEach(async () => {
    userRepo = new InMemoryUserRepository();
    useCase = new MeUseCase(userRepo);
    savedUser = User.create({ email: Email.load('user@example.com'), passwordHash: 'hash', role: 'default', name: 'Alice' });
    await userRepo.save(savedUser);
  });

  it('returns user profile for a valid userId', async () => {
    const result = await useCase.execute({ userId: savedUser.id });
    expect(result.id).toBe(savedUser.id);
    expect(result.email).toBe('user@example.com');
    expect(result.name).toBe('Alice');
    expect(result.role).toBe('default');
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it('does not include passwordHash in output', async () => {
    const result = await useCase.execute({ userId: savedUser.id });
    expect('passwordHash' in result).toBe(false);
  });

  it('throws UserNotFoundError for non-existent userId', async () => {
    await expect(useCase.execute({ userId: 'nonexistent-id' }))
      .rejects.toThrow(UserNotFoundError);
  });
});
