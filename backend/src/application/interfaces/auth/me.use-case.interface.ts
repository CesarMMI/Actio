import { Injectable } from "../../../di-container/di-container-injectable";
import type { MeInput } from "../../types/inputs/auth/me.input";
import type { MeOutput } from "../../types/outputs/auth/me.output";
import type { IUseCase } from "../use-case.interface";

export const ME_USE_CASE = new Injectable<IMeUseCase>("IMeUseCase");

export interface IMeUseCase extends IUseCase<MeInput, MeOutput> {}
