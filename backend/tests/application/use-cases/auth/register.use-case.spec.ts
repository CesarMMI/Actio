import { RegisterUseCase } from '../../../../src/application/use-cases/auth/register.use-case';
import { EmailAlreadyTakenError } from '../../../../src/domain/errors/auth/email-already-taken.error';
import { PasswordTooShortError } from '../../../../src/domain/errors/auth/password-too-short.error';
import { PasswordTooLongError } from '../../../../src/domain/errors/auth/password-too-long.error';
import { InvalidEmailError } from '../../../../src/domain/errors/auth/invalid-email.error';
import { InMemoryUserRepository } from '../../mocks/in-memory-user.repository';
import { InMemoryRefreshTokenRepository } from '../../mocks/in-memory-refresh-token.repository';
import { FakePasswordService } from '../../mocks/fake-password.service';
import { FakeTokenService } from '../../mocks/fake-token.service';

describe('UC-A01 — Register', () => {
  let useCase: RegisterUseCase;
  let userRepo: InMemoryUserRepository;
  let refreshTokenRepo: InMemoryRefreshTokenRepository;
  let passwordService: FakePasswordService;
  let tokenService: FakeTokenService;

  beforeEach(() => {
    userRepo = new InMemoryUserRepository();
    refreshTokenRepo = new InMemoryRefreshTokenRepository();
    passwordService = new FakePasswordService();
    tokenService = new FakeTokenService();
    useCase = new RegisterUseCase(userRepo, passwordService, tokenService, refreshTokenRepo);
  });

  it('registers a user and returns tokens', async () => {
    const result = await useCase.execute({ email: 'user@example.com', password: 'password123', deviceId: 'device-1' });
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });

  it('stores the user with hashed password', async () => {
    await useCase.execute({ email: 'user@example.com', password: 'password123', deviceId: 'device-1' });
    const user = await userRepo.findByEmailString('user@example.com');
    expect(user).not.toBeNull();
    expect(user!.passwordHash).toBe('hashed:password123');
    expect(user!.passwordHash).not.toBe('password123');
  });

  it('stores user with default role', async () => {
    await useCase.execute({ email: 'user@example.com', password: 'password123', deviceId: 'device-1' });
    const user = await userRepo.findByEmailString('user@example.com');
    expect(user!.role).toBe('default');
  });

  it('stores optional name', async () => {
    await useCase.execute({ email: 'user@example.com', password: 'password123', name: 'Alice', deviceId: 'device-1' });
    const user = await userRepo.findByEmailString('user@example.com');
    expect(user!.name).toBe('Alice');
  });

  it('saves a refresh token for the device', async () => {
    const result = await useCase.execute({ email: 'user@example.com', password: 'password123', deviceId: 'device-1' });
    const token = await refreshTokenRepo.findByHash(
      require('crypto').createHash('sha256').update(result.refreshToken).digest('hex'),
    );
    expect(token).not.toBeNull();
    expect(token!.deviceId).toBe('device-1');
    expect(token!.expiresAt).toBeInstanceOf(Date);
  });

  it('returns different refresh tokens on each call', async () => {
    const r1 = await useCase.execute({ email: 'user1@example.com', password: 'password123', deviceId: 'device-1' });
    const r2 = await useCase.execute({ email: 'user2@example.com', password: 'password456', deviceId: 'device-1' });
    expect(r1.refreshToken).not.toBe(r2.refreshToken);
  });

  it('rejects password shorter than 5 characters', async () => {
    await expect(useCase.execute({ email: 'user@example.com', password: 'ab12', deviceId: 'device-1' }))
      .rejects.toThrow(PasswordTooShortError);
  });

  it('rejects password longer than 50 characters', async () => {
    await expect(useCase.execute({ email: 'user@example.com', password: 'a'.repeat(51), deviceId: 'device-1' }))
      .rejects.toThrow(PasswordTooLongError);
  });

  it('rejects invalid email', async () => {
    await expect(useCase.execute({ email: 'not-an-email', password: 'password123', deviceId: 'device-1' }))
      .rejects.toThrow(InvalidEmailError);
  });

  it('rejects duplicate email', async () => {
    await useCase.execute({ email: 'user@example.com', password: 'password123', deviceId: 'device-1' });
    await expect(useCase.execute({ email: 'user@example.com', password: 'password456', deviceId: 'device-2' }))
      .rejects.toThrow(EmailAlreadyTakenError);
  });

  it('normalizes email to lowercase before duplicate check', async () => {
    await useCase.execute({ email: 'User@Example.com', password: 'password123', deviceId: 'device-1' });
    await expect(useCase.execute({ email: 'user@example.com', password: 'password456', deviceId: 'device-2' }))
      .rejects.toThrow(EmailAlreadyTakenError);
  });
});
