import { createHash, randomBytes } from "crypto";
import jwt from "jsonwebtoken";
import {
  AccessTokenPayload,
  ITokenService,
  RefreshTokenResult,
} from "../../application/interfaces/token-service.interface";
import { UserRole } from "../../domain/entities/user/user.props";
import { UnauthorizedError } from "../../domain/errors/auth/unauthorized.error";

export class JwtTokenService implements ITokenService {
  private readonly secret: string;
  private readonly accessTtlSeconds: number;
  private readonly refreshTtlDays: number;

  constructor(env: NodeJS.ProcessEnv) {
    const secret = env["JWT_SECRET"];
    if (!secret)
      throw new Error("JWT_SECRET environment variable is required.");
    this.secret = secret;
    this.accessTtlSeconds = env["JWT_ACCESS_TTL"]
      ? parseInt(env["JWT_ACCESS_TTL"], 10)
      : 900;
    this.refreshTtlDays = env["REFRESH_TOKEN_TTL_DAYS"]
      ? parseInt(env["REFRESH_TOKEN_TTL_DAYS"], 10)
      : 30;
  }

  issueAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign({ sub: payload.sub, role: payload.role }, this.secret, {
      expiresIn: this.accessTtlSeconds,
    });
  }

  issueRefreshToken(): RefreshTokenResult {
    const raw = randomBytes(32).toString("hex");
    const hash = createHash("sha256").update(raw).digest("hex");
    const expiresAt = new Date(
      Date.now() + this.refreshTtlDays * 24 * 60 * 60 * 1000,
    );
    return { raw, hash, expiresAt };
  }

  hashToken(raw: string): string {
    return createHash("sha256").update(raw).digest("hex");
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as jwt.JwtPayload;
      return {
        sub: decoded["sub"] as string,
        role: decoded["role"] as UserRole,
      };
    } catch {
      throw new UnauthorizedError();
    }
  }
}
