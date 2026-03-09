import { User } from '../../entities/user.entity';

export const IUserRepository = Symbol('IUserRepository');

export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}
