import { RefreshToken } from "../../../domain/entities/refresh-token/refresh-token.entity";
import { InvalidCredentialsError } from "../../../domain/errors/auth/invalid-credentials.error";
import { IRefreshTokenRepository } from "../../../domain/interfaces/refresh-token-repository.interface";
import { IUserRepository } from "../../../domain/interfaces/user-repository.interface";
import { Email } from "../../../domain/value-objects/email/email.value-object";
import { ILoginUseCase } from "../../interfaces/auth/login.use-case.interface";
import { IPasswordService } from "../../interfaces/password-service.interface";
import { ITokenService } from "../../interfaces/token-service.interface";
import type { LoginInput } from "../../types/inputs/auth/login.input";
import type { AuthTokensOutput } from "../../types/outputs/auth/auth-tokens.output";

export class LoginUseCase implements ILoginUseCase {
  constructor(
    private readonly users: IUserRepository,
    private readonly passwords: IPasswordService,
    private readonly tokens: ITokenService,
    private readonly refreshTokens: IRefreshTokenRepository,
  ) {}

  async execute(input: LoginInput): Promise<AuthTokensOutput> {
    const email = Email.create(input.email);
    const user = await this.users.findByEmail(email);
    if (!user) throw new InvalidCredentialsError();

    const valid = await this.passwords.compare(input.password, user.passwordHash);
    if (!valid) throw new InvalidCredentialsError();

    const { raw, hash, expiresAt } = this.tokens.issueRefreshToken();
    await this.refreshTokens.save(RefreshToken.create(user.id, hash, expiresAt, input.deviceId));

    const accessToken = this.tokens.issueAccessToken({ sub: user.id, role: user.role });
    return { accessToken, refreshToken: raw };
  }
}
