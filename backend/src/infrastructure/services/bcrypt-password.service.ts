import bcrypt from "bcryptjs";
import { IPasswordService } from "../../application/interfaces/password-service.interface";

export class BcryptPasswordService implements IPasswordService {
  private readonly saltRounds: number;

  constructor(env: NodeJS.ProcessEnv) {
    this.saltRounds = env["PASSWORD_SALT_ROUNDS"]
      ? parseInt(env["PASSWORD_SALT_ROUNDS"], 10)
      : 10;
  }

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.saltRounds);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
