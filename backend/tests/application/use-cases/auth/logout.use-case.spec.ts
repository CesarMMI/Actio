import { LogoutUseCase } from '../../../../src/application/use-cases/auth/logout.use-case';
import { LoginUseCase } from '../../../../src/application/use-cases/auth/login.use-case';
import { RegisterUseCase } from '../../../../src/application/use-cases/auth/register.use-case';
import { RefreshTokenExpiredError } from '../../../../src/domain/errors/auth/refresh-token-expired.error';
import { UnauthorizedError } from '../../../../src/domain/errors/auth/unauthorized.error';
import { InMemoryUserRepository } from '../../mocks/in-memory-user.repository';
import { InMemoryRefreshTokenRepository } from '../../mocks/in-memory-refresh-token.repository';
import { FakePasswordService } from '../../mocks/fake-password.service';
import { FakeTokenService } from '../../mocks/fake-token.service';

describe('UC-A05 — Logout', () => {
  let logoutUseCase: LogoutUseCase;
  let registerUseCase: RegisterUseCase;
  let loginUseCase: LoginUseCase;
  let refreshTokenRepo: InMemoryRefreshTokenRepository;
  let tokenService: FakeTokenService;
  let loginResult: { refreshToken: string };

  beforeEach(async () => {
    const userRepo = new InMemoryUserRepository();
    refreshTokenRepo = new InMemoryRefreshTokenRepository();
    const passwordService = new FakePasswordService();
    tokenService = new FakeTokenService();
    registerUseCase = new RegisterUseCase(userRepo, passwordService, tokenService, refreshTokenRepo);
    loginUseCase = new LoginUseCase(userRepo, passwordService, tokenService, refreshTokenRepo);
    logoutUseCase = new LogoutUseCase(refreshTokenRepo, tokenService);
    await registerUseCase.execute({ email: 'user@example.com', password: 'password123', deviceId: 'device-1' });
    loginResult = await loginUseCase.execute({ email: 'user@example.com', password: 'password123', deviceId: 'device-1' });
  });

  it('deletes the refresh token on logout', async () => {
    await logoutUseCase.execute({ refreshToken: loginResult.refreshToken });
    const hash = tokenService.hashToken(loginResult.refreshToken);
    expect(await refreshTokenRepo.findByHash(hash)).toBeNull();
  });

  it('returns void on successful logout', async () => {
    const result = await logoutUseCase.execute({ refreshToken: loginResult.refreshToken });
    expect(result).toBeUndefined();
  });

  it('throws UnauthorizedError for unknown token', async () => {
    await expect(logoutUseCase.execute({ refreshToken: 'unknown-token' }))
      .rejects.toThrow(UnauthorizedError);
  });

  it('throws UnauthorizedError when token already cleared (double logout)', async () => {
    await logoutUseCase.execute({ refreshToken: loginResult.refreshToken });
    await expect(logoutUseCase.execute({ refreshToken: loginResult.refreshToken }))
      .rejects.toThrow(UnauthorizedError);
  });

  it('throws RefreshTokenExpiredError for expired token', async () => {
    refreshTokenRepo.expireByRaw(loginResult.refreshToken);
    await expect(logoutUseCase.execute({ refreshToken: loginResult.refreshToken }))
      .rejects.toThrow(RefreshTokenExpiredError);
  });
});
