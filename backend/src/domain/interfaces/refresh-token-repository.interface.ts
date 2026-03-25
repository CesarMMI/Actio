import { Injectable } from "../../di-container/di-container-injectable";
import { RefreshToken } from "../entities/refresh-token/refresh-token.entity";
import { IRepository } from "./repository.interface";

export const REFRESH_TOKEN_REPOSITORY = new Injectable<IRefreshTokenRepository>("IRefreshTokenRepository");

export interface IRefreshTokenRepository extends IRepository<RefreshToken> {
  findByHash(hash: string): Promise<RefreshToken | null>;
  deleteByHash(hash: string): Promise<void>;
}
