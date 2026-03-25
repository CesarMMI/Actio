import { RefreshToken } from "../../../domain/entities/refresh-token/refresh-token.entity";
import { RefreshTokenExpiredError } from "../../../domain/errors/auth/refresh-token-expired.error";
import { UnauthorizedError } from "../../../domain/errors/auth/unauthorized.error";
import { IRefreshTokenRepository } from "../../../domain/interfaces/refresh-token-repository.interface";
import { IUserRepository } from "../../../domain/interfaces/user-repository.interface";
import { IRefreshUseCase } from "../../interfaces/auth/refresh.use-case.interface";
import { ITokenService } from "../../interfaces/token-service.interface";
import type { RefreshInput } from "../../types/inputs/auth/refresh.input";
import type { AuthTokensOutput } from "../../types/outputs/auth/auth-tokens.output";

export class RefreshUseCase implements IRefreshUseCase {
  constructor(
    private readonly users: IUserRepository,
    private readonly tokens: ITokenService,
    private readonly refreshTokens: IRefreshTokenRepository,
  ) {}

  async execute(input: RefreshInput): Promise<AuthTokensOutput> {
    const hash = this.tokens.hashToken(input.refreshToken);
    const token = await this.refreshTokens.findByHash(hash);
    if (!token) throw new UnauthorizedError();

    if (token.isExpired()) throw new RefreshTokenExpiredError();

    const user = await this.users.findById(token.userId);
    if (!user) throw new UnauthorizedError();

    const { raw, hash: newHash, expiresAt } = this.tokens.issueRefreshToken();
    await this.refreshTokens.deleteByHash(hash);
    await this.refreshTokens.save(RefreshToken.create(user.id, newHash, expiresAt, token.deviceId));

    const accessToken = this.tokens.issueAccessToken({ sub: user.id, role: user.role });
    return { accessToken, refreshToken: raw };
  }
}
