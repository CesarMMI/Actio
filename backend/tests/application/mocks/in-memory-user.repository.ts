import { User } from '../../../src/domain/entities/user/user.entity';
import { IUserRepository } from '../../../src/domain/interfaces/user-repository.interface';
import { Email } from '../../../src/domain/value-objects/email/email.value-object';

export class InMemoryUserRepository implements IUserRepository {
  private store = new Map<string, User>();

  async save(user: User): Promise<User> {
    this.store.set(user.id, user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.store.get(id) ?? null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    for (const user of this.store.values()) {
      if (user.email.value === email.value) return user;
    }
    return null;
  }

  /** Test helper: find by raw email string */
  async findByEmailString(email: string): Promise<User | null> {
    for (const user of this.store.values()) {
      if (user.email.value === email) return user;
    }
    return null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.store.values());
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
