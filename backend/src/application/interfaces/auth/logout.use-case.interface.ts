import { Injectable } from "../../../di-container/di-container-injectable";
import type { LogoutInput } from "../../types/inputs/auth/logout.input";
import type { IUseCase } from "../use-case.interface";

export const LOGOUT_USE_CASE = new Injectable<ILogoutUseCase>("ILogoutUseCase");

export interface ILogoutUseCase extends IUseCase<LogoutInput, void> {}
