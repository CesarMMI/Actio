import { UserNotFoundError } from "../../../domain/errors/auth/user-not-found.error";
import { IUserRepository } from "../../../domain/interfaces/user-repository.interface";
import { IMeUseCase } from "../../interfaces/auth/me.use-case.interface";
import type { MeInput } from "../../types/inputs/auth/me.input";
import type { MeOutput } from "../../types/outputs/auth/me.output";

export class MeUseCase implements IMeUseCase {
  constructor(private readonly users: IUserRepository) {}

  async execute(input: MeInput): Promise<MeOutput> {
    const user = await this.users.findById(input.userId);
    if (!user) throw new UserNotFoundError();

    return {
      id: user.id,
      email: user.email.value,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
