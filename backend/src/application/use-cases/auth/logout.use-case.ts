import { RefreshTokenExpiredError } from "../../../domain/errors/auth/refresh-token-expired.error";
import { UnauthorizedError } from "../../../domain/errors/auth/unauthorized.error";
import { IRefreshTokenRepository } from "../../../domain/interfaces/refresh-token-repository.interface";
import { ILogoutUseCase } from "../../interfaces/auth/logout.use-case.interface";
import { ITokenService } from "../../interfaces/token-service.interface";
import type { LogoutInput } from "../../types/inputs/auth/logout.input";

export class LogoutUseCase implements ILogoutUseCase {
  constructor(
    private readonly refreshTokens: IRefreshTokenRepository,
    private readonly tokens: ITokenService,
  ) {}

  async execute(input: LogoutInput): Promise<void> {
    const hash = this.tokens.hashToken(input.refreshToken);
    const token = await this.refreshTokens.findByHash(hash);
    if (!token) throw new UnauthorizedError();

    if (token.isExpired()) throw new RefreshTokenExpiredError();

    await this.refreshTokens.deleteByHash(hash);
  }
}
