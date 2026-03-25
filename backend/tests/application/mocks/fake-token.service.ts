import { createHash } from 'crypto';
import {
  AccessTokenPayload,
  ITokenService,
  RefreshTokenResult,
} from '../../../src/application/interfaces/token-service.interface';
import { UnauthorizedError } from '../../../src/domain/errors/auth/unauthorized.error';

export class FakeTokenService implements ITokenService {
  private tokens = new Map<string, AccessTokenPayload>();
  private counter = 0;

  issueAccessToken(payload: AccessTokenPayload): string {
    const token = `fake-access-${++this.counter}`;
    this.tokens.set(token, payload);
    return token;
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    const payload = this.tokens.get(token);
    if (!payload) throw new UnauthorizedError();
    return payload;
  }

  issueRefreshToken(): RefreshTokenResult {
    const raw = `fake-refresh-${++this.counter}`;
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return { raw, hash: this.hashToken(raw), expiresAt };
  }

  hashToken(raw: string): string {
    return createHash('sha256').update(raw).digest('hex');
  }
}
