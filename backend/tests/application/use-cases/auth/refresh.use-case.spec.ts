import { LoginUseCase } from '../../../../src/application/use-cases/auth/login.use-case';
import { RefreshUseCase } from '../../../../src/application/use-cases/auth/refresh.use-case';
import { RegisterUseCase } from '../../../../src/application/use-cases/auth/register.use-case';
import { RefreshTokenExpiredError } from '../../../../src/domain/errors/auth/refresh-token-expired.error';
import { UnauthorizedError } from '../../../../src/domain/errors/auth/unauthorized.error';
import { InMemoryUserRepository } from '../../mocks/in-memory-user.repository';
import { InMemoryRefreshTokenRepository } from '../../mocks/in-memory-refresh-token.repository';
import { FakePasswordService } from '../../mocks/fake-password.service';
import { FakeTokenService } from '../../mocks/fake-token.service';

describe('UC-A03 — Refresh Tokens', () => {
  let refreshUseCase: RefreshUseCase;
  let registerUseCase: RegisterUseCase;
  let loginUseCase: LoginUseCase;
  let userRepo: InMemoryUserRepository;
  let refreshTokenRepo: InMemoryRefreshTokenRepository;
  let tokenService: FakeTokenService;
  let loginResult: { accessToken: string; refreshToken: string };

  beforeEach(async () => {
    userRepo = new InMemoryUserRepository();
    refreshTokenRepo = new InMemoryRefreshTokenRepository();
    const passwordService = new FakePasswordService();
    tokenService = new FakeTokenService();
    registerUseCase = new RegisterUseCase(userRepo, passwordService, tokenService, refreshTokenRepo);
    loginUseCase = new LoginUseCase(userRepo, passwordService, tokenService, refreshTokenRepo);
    refreshUseCase = new RefreshUseCase(userRepo, tokenService, refreshTokenRepo);
    await registerUseCase.execute({ email: 'user@example.com', password: 'password123', deviceId: 'device-1' });
    loginResult = await loginUseCase.execute({ email: 'user@example.com', password: 'password123', deviceId: 'device-1' });
  });

  it('returns new tokens for valid refresh token', async () => {
    const result = await refreshUseCase.execute({ refreshToken: loginResult.refreshToken });
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });

  it('rotates token — old token no longer works after refresh', async () => {
    await refreshUseCase.execute({ refreshToken: loginResult.refreshToken });
    await expect(refreshUseCase.execute({ refreshToken: loginResult.refreshToken }))
      .rejects.toThrow(UnauthorizedError);
  });

  it('new access token contains correct userId', async () => {
    const user = await userRepo.findByEmailString('user@example.com');
    const result = await refreshUseCase.execute({ refreshToken: loginResult.refreshToken });
    const payload = tokenService.verifyAccessToken(result.accessToken);
    expect(payload.sub).toBe(user!.id);
  });

  it('new access token contains correct role', async () => {
    const result = await refreshUseCase.execute({ refreshToken: loginResult.refreshToken });
    const payload = tokenService.verifyAccessToken(result.accessToken);
    expect(payload.role).toBe('default');
  });

  it('throws UnauthorizedError for unknown token', async () => {
    await expect(refreshUseCase.execute({ refreshToken: 'unknown-token' }))
      .rejects.toThrow(UnauthorizedError);
  });

  it('throws RefreshTokenExpiredError for expired token', async () => {
    refreshTokenRepo.expireByRaw(loginResult.refreshToken);
    await expect(refreshUseCase.execute({ refreshToken: loginResult.refreshToken }))
      .rejects.toThrow(RefreshTokenExpiredError);
  });
});
