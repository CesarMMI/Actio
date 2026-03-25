import { v4 as uuid } from "uuid";
import { Entity } from "../entity/entity";
import { RefreshTokenProps } from "./refresh-token.props";

export class RefreshToken extends Entity {
  readonly userId: string;
  readonly hash: string;
  readonly expiresAt: Date;
  readonly deviceId: string;

  private constructor(props: RefreshTokenProps) {
    super(props);
    this.userId = props.userId;
    this.hash = props.hash;
    this.expiresAt = props.expiresAt;
    this.deviceId = props.deviceId;
  }

  static create(userId: string, hash: string, expiresAt: Date, deviceId: string): RefreshToken {
    const now = new Date();
    return new RefreshToken({ id: uuid(), userId, hash, expiresAt, deviceId, createdAt: now, updatedAt: now });
  }

  static load(props: RefreshTokenProps): RefreshToken {
    return new RefreshToken(props);
  }

  isExpired(): boolean {
    return this.expiresAt < new Date();
  }
}
