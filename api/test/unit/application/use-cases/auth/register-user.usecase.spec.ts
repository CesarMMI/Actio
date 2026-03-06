import { RegisterUserUseCase } from '../../../../../src/application/use-cases/auth/register-user.usecase';
import { IUserRepository } from '../../../../../src/domain/interfaces/repositories/user-repository.interface';
import { IIdGenerator } from '../../../../../src/application/interfaces/services/id-generator.interface';
import { IPasswordHasher } from '../../../../../src/application/interfaces/services/password-hasher.interface';
import { ConflictError } from '../../../../../src/application/errors/conflict.error';

describe('RegisterUserUseCase', () => {
  const makeUsers = (): jest.Mocked<IUserRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
  });

  const makeIds = (): jest.Mocked<IIdGenerator> => ({
    newId: jest.fn(),
  });

  const makeHasher = (): jest.Mocked<IPasswordHasher> => ({
    hash: jest.fn(),
    verify: jest.fn(),
  });

  it('rejects duplicate email', async () => {
    const users = makeUsers();
    const ids = makeIds();
    const hasher = makeHasher();

    users.findByEmail.mockResolvedValue({
      id: 'u1',
      email: 'a@b.com',
      passwordHash: 'hashhashhash',
    });

    const useCase = new RegisterUserUseCase(users, ids, hasher);
    await expect(
      useCase.execute({ email: 'A@B.COM', password: 'pw' }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it('creates user with hashed password and persists it', async () => {
    const users = makeUsers();
    const ids = makeIds();
    const hasher = makeHasher();

    ids.newId.mockReturnValue('u1');
    users.findByEmail.mockResolvedValue(null);
    hasher.hash.mockResolvedValue('hashhashhash');
    users.save.mockImplementation((u) => Promise.resolve(u));

    const useCase = new RegisterUserUseCase(users, ids, hasher);
    const result = await useCase.execute({
      email: 'Test@Example.com',
      password: 'pw',
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(users.save).toHaveBeenCalledTimes(1);
    expect(result.user).toEqual({ id: 'u1', email: 'test@example.com' });
  });
});
