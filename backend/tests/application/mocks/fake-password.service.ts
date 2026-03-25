import { IPasswordService } from '../../../src/application/interfaces/password-service.interface';

export class FakePasswordService implements IPasswordService {
  async hash(plain: string): Promise<string> {
    return `hashed:${plain}`;
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return hash === `hashed:${plain}`;
  }
}
