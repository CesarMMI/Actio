import { Injectable } from "../../../di-container/di-container-injectable";
import type { RegisterInput } from "../../types/inputs/auth/register.input";
import type { AuthTokensOutput } from "../../types/outputs/auth/auth-tokens.output";
import type { IUseCase } from "../use-case.interface";

export const REGISTER_USE_CASE = new Injectable<IRegisterUseCase>("IRegisterUseCase");

export interface IRegisterUseCase extends IUseCase<RegisterInput, AuthTokensOutput> {}
