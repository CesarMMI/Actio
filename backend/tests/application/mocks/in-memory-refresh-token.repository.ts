import { createHash } from "crypto";
import { RefreshToken } from "../../../src/domain/entities/refresh-token/refresh-token.entity";
import { IRefreshTokenRepository } from "../../../src/domain/interfaces/refresh-token-repository.interface";

export class InMemoryRefreshTokenRepository implements IRefreshTokenRepository {
  private store = new Map<string, RefreshToken>();

  async save(token: RefreshToken): Promise<RefreshToken> {
    for (const [id, existing] of this.store.entries()) {
      if (
        existing.userId === token.userId &&
        existing.deviceId === token.deviceId
      ) {
        this.store.delete(id);
        break;
      }
    }
    this.store.set(token.id, token);
    return token;
  }

  async findByHash(hash: string): Promise<RefreshToken | null> {
    for (const token of this.store.values()) {
      if (token.hash === hash) return token;
    }
    return null;
  }

  async deleteByHash(hash: string): Promise<void> {
    for (const [id, token] of this.store.entries()) {
      if (token.hash === hash) {
        this.store.delete(id);
        return;
      }
    }
  }

  async findById(id: string): Promise<RefreshToken | null> {
    return this.store.get(id) ?? null;
  }

  async findAll(): Promise<RefreshToken[]> {
    return Array.from(this.store.values());
  }

  async delete(id: string): Promise<void> {
    for (const token of this.store.values()) {
      if (token.id === id) {
        this.store.delete(id);
        return;
      }
    }
  }

  /** Test helper: force-expire a token by raw value */
  expireByRaw(raw: string): void {
    const hash = createHash("sha256").update(raw).digest("hex");
    for (const token of this.store.values()) {
      if (token.hash === hash) {
        (token as any).expiresAt = new Date(Date.now() - 1000);
        return;
      }
    }
  }
}
