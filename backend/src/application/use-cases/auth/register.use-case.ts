import { RefreshToken } from "../../../domain/entities/refresh-token/refresh-token.entity";
import { User } from "../../../domain/entities/user/user.entity";
import { EmailAlreadyTakenError } from "../../../domain/errors/auth/email-already-taken.error";
import { IRefreshTokenRepository } from "../../../domain/interfaces/refresh-token-repository.interface";
import { IUserRepository } from "../../../domain/interfaces/user-repository.interface";
import { Email } from "../../../domain/value-objects/email/email.value-object";
import { Password } from "../../../domain/value-objects/password/password.value-object";
import { IRegisterUseCase } from "../../interfaces/auth/register.use-case.interface";
import { IPasswordService } from "../../interfaces/password-service.interface";
import { ITokenService } from "../../interfaces/token-service.interface";
import type { RegisterInput } from "../../types/inputs/auth/register.input";
import type { AuthTokensOutput } from "../../types/outputs/auth/auth-tokens.output";

export class RegisterUseCase implements IRegisterUseCase {
  constructor(
    private readonly users: IUserRepository,
    private readonly passwords: IPasswordService,
    private readonly tokens: ITokenService,
    private readonly refreshTokens: IRefreshTokenRepository,
  ) {}

  async execute(input: RegisterInput): Promise<AuthTokensOutput> {
    const email = Email.create(input.email);
    const password = Password.create(input.password);

    const existing = await this.users.findByEmail(email);
    if (existing) throw new EmailAlreadyTakenError(input.email);

    const passwordHash = await this.passwords.hash(password.value);
    const user = User.create({ email, passwordHash, name: input.name, role: "default" });
    await this.users.save(user);

    const { raw, hash, expiresAt } = this.tokens.issueRefreshToken();
    const refreshToken = RefreshToken.create(user.id, hash, expiresAt, input.deviceId);
    await this.refreshTokens.save(refreshToken);

    const accessToken = this.tokens.issueAccessToken({ sub: user.id, role: user.role });
    return { accessToken, refreshToken: raw };
  }
}
