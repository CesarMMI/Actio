import { Injectable } from "../../di-container/di-container-injectable";
import { UserRole } from "../../domain/entities/user/user.props";

export interface AccessTokenPayload {
  sub: string;
  role: UserRole;
}

export interface RefreshTokenResult {
  raw: string;
  hash: string;
  expiresAt: Date;
}

export const TOKEN_SERVICE = new Injectable<ITokenService>("ITokenService");

export interface ITokenService {
  issueAccessToken(payload: AccessTokenPayload): string;
  issueRefreshToken(): RefreshTokenResult;
  verifyAccessToken(token: string): AccessTokenPayload;
  hashToken(raw: string): string;
}
