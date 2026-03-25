import { Injectable } from "../../../di-container/di-container-injectable";
import type { RefreshInput } from "../../types/inputs/auth/refresh.input";
import type { AuthTokensOutput } from "../../types/outputs/auth/auth-tokens.output";
import type { IUseCase } from "../use-case.interface";

export const REFRESH_USE_CASE = new Injectable<IRefreshUseCase>("IRefreshUseCase");

export interface IRefreshUseCase extends IUseCase<RefreshInput, AuthTokensOutput> {}
