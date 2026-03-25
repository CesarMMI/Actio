import { Injectable } from "../../../di-container/di-container-injectable";
import type { LoginInput } from "../../types/inputs/auth/login.input";
import type { AuthTokensOutput } from "../../types/outputs/auth/auth-tokens.output";
import type { IUseCase } from "../use-case.interface";

export const LOGIN_USE_CASE = new Injectable<ILoginUseCase>("ILoginUseCase");

export interface ILoginUseCase extends IUseCase<LoginInput, AuthTokensOutput> {}
