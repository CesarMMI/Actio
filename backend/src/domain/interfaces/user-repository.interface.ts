import { Injectable } from "../../di-container/di-container-injectable";
import { User } from "../entities/user/user.entity";
import { Email } from "../value-objects/email/email.value-object";
import { IRepository } from "./repository.interface";

export const USER_REPOSITORY = new Injectable<IUserRepository>("IUserRepository");

export interface IUserRepository extends IRepository<User> {
  findByEmail(email: Email): Promise<User | null>;
}
