import { LoginUseCase } from '../../../../../src/application/use-cases/auth/login.usecase';
import { IUserRepository } from '../../../../../src/domain/interfaces/repositories/user-repository.interface';
import { IPasswordHasher } from '../../../../../src/application/interfaces/services/password-hasher.interface';
import { ITokenService } from '../../../../../src/application/interfaces/services/token-service.interface';
import { AuthenticationError } from '../../../../../src/application/errors/authentication.error';

describe('LoginUseCase', () => {
  const makeUsers = (): jest.Mocked<IUserRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
  });

  const makeHasher = (): jest.Mocked<IPasswordHasher> => ({
    hash: jest.fn(),
    verify: jest.fn(),
  });

  const makeTokens = (): jest.Mocked<ITokenService> => ({
    signAccessToken: jest.fn(),
    verifyAccessToken: jest.fn(),
  });

  it('rejects when email is unknown', async () => {
    const users = makeUsers();
    const hasher = makeHasher();
    const tokens = makeTokens();

    users.findByEmail.mockResolvedValue(null);

    const useCase = new LoginUseCase(users, hasher, tokens);
    await expect(
      useCase.execute({ email: 'a@b.com', password: 'pw' }),
    ).rejects.toBeInstanceOf(AuthenticationError);
  });

  it('rejects when password is invalid', async () => {
    const users = makeUsers();
    const hasher = makeHasher();
    const tokens = makeTokens();

    users.findByEmail.mockResolvedValue({
      id: 'u1',
      email: 'a@b.com',
      passwordHash: 'hashhashhash',
    });
    hasher.verify.mockResolvedValue(false);

    const useCase = new LoginUseCase(users, hasher, tokens);
    await expect(
      useCase.execute({ email: 'a@b.com', password: 'pw' }),
    ).rejects.toBeInstanceOf(AuthenticationError);
  });

  it('returns access token for valid credentials', async () => {
    const users = makeUsers();
    const hasher = makeHasher();
    const tokens = makeTokens();

    users.findByEmail.mockResolvedValue({
      id: 'u1',
      email: 'a@b.com',
      passwordHash: 'hashhashhash',
    });
    hasher.verify.mockResolvedValue(true);
    tokens.signAccessToken.mockResolvedValue('token-1');

    const useCase = new LoginUseCase(users, hasher, tokens);
    const result = await useCase.execute({ email: 'A@B.com', password: 'pw' });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(tokens.signAccessToken).toHaveBeenCalledWith({
      userId: 'u1',
      email: 'a@b.com',
    });
    expect(result).toEqual({ accessToken: 'token-1' });
  });
});
