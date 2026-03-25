import { LoginUseCase } from '../../../../src/application/use-cases/auth/login.use-case';
import { RegisterUseCase } from '../../../../src/application/use-cases/auth/register.use-case';
import { InvalidCredentialsError } from '../../../../src/domain/errors/auth/invalid-credentials.error';
import { InMemoryUserRepository } from '../../mocks/in-memory-user.repository';
import { InMemoryRefreshTokenRepository } from '../../mocks/in-memory-refresh-token.repository';
import { FakePasswordService } from '../../mocks/fake-password.service';
import { FakeTokenService } from '../../mocks/fake-token.service';

describe('UC-A02 — Login', () => {
  let loginUseCase: LoginUseCase;
  let registerUseCase: RegisterUseCase;
  let userRepo: InMemoryUserRepository;
  let refreshTokenRepo: InMemoryRefreshTokenRepository;
  let passwordService: FakePasswordService;
  let tokenService: FakeTokenService;

  beforeEach(async () => {
    userRepo = new InMemoryUserRepository();
    refreshTokenRepo = new InMemoryRefreshTokenRepository();
    passwordService = new FakePasswordService();
    tokenService = new FakeTokenService();
    loginUseCase = new LoginUseCase(userRepo, passwordService, tokenService, refreshTokenRepo);
    registerUseCase = new RegisterUseCase(userRepo, passwordService, tokenService, refreshTokenRepo);
    await registerUseCase.execute({ email: 'user@example.com', password: 'password123', deviceId: 'device-1' });
  });

  it('returns tokens for valid credentials', async () => {
    const result = await loginUseCase.execute({ email: 'user@example.com', password: 'password123', deviceId: 'device-1' });
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });

  it('issues new refresh token on each login', async () => {
    const r1 = await loginUseCase.execute({ email: 'user@example.com', password: 'password123', deviceId: 'device-1' });
    const r2 = await loginUseCase.execute({ email: 'user@example.com', password: 'password123', deviceId: 'device-1' });
    expect(r1.refreshToken).not.toBe(r2.refreshToken);
  });

  it('throws InvalidCredentialsError for wrong password', async () => {
    await expect(loginUseCase.execute({ email: 'user@example.com', password: 'wrongpassword', deviceId: 'device-1' }))
      .rejects.toThrow(InvalidCredentialsError);
  });

  it('throws InvalidCredentialsError for unknown email', async () => {
    await expect(loginUseCase.execute({ email: 'unknown@example.com', password: 'password123', deviceId: 'device-1' }))
      .rejects.toThrow(InvalidCredentialsError);
  });

  it('same error type for wrong password and unknown email (no oracle)', async () => {
    const err1 = await loginUseCase.execute({ email: 'user@example.com', password: 'wrong', deviceId: 'device-1' }).catch(e => e);
    const err2 = await loginUseCase.execute({ email: 'nobody@example.com', password: 'password123', deviceId: 'device-1' }).catch(e => e);
    expect(err1.constructor.name).toBe(err2.constructor.name);
  });
});
