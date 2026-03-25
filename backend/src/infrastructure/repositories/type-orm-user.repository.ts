import { DataSource, Repository } from "typeorm";
import { User } from "../../domain/entities/user/user.entity";
import { UserRole } from "../../domain/entities/user/user.props";
import { IUserRepository } from "../../domain/interfaces/user-repository.interface";
import { Email } from "../../domain/value-objects/email/email.value-object";
import { UserOrmEntity } from "../entities/user.orm-entity";

export class TypeOrmUserRepository implements IUserRepository {
  private readonly repo: Repository<UserOrmEntity>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(UserOrmEntity);
  }

  async save(user: User): Promise<User> {
    await this.repo.save(this.toOrm(user));
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repo.findOneBy({ id });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const entity = await this.repo.findOneBy({ email: email.value });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<User[]> {
    const entities = await this.repo.find({ order: { createdAt: "ASC" } });
    return entities.map((e) => this.toDomain(e));
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  private toDomain(entity: UserOrmEntity): User {
    return User.load({
      id: entity.id,
      email: Email.load(entity.email),
      passwordHash: entity.passwordHash,
      role: entity.role as UserRole,
      name: entity.name ?? undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private toOrm(user: User): UserOrmEntity {
    const entity = new UserOrmEntity();
    entity.id = user.id;
    entity.email = user.email.value;
    entity.passwordHash = user.passwordHash;
    entity.role = user.role;
    entity.name = user.name ?? null;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    return entity;
  }
}
