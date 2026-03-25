import { Injectable } from "../../di-container/di-container-injectable";

export const PASSWORD_SERVICE = new Injectable<IPasswordService>("IPasswordService");

export interface IPasswordService {
  hash(plain: string): Promise<string>;
  compare(plain: string, hash: string): Promise<boolean>;
}
