import { DataSource, Repository } from "typeorm";
import { RefreshToken } from "../../domain/entities/refresh-token/refresh-token.entity";
import { IRefreshTokenRepository } from "../../domain/interfaces/refresh-token-repository.interface";
import { RefreshTokenOrmEntity } from "../entities/refresh-token.orm-entity";

export class TypeOrmRefreshTokenRepository implements IRefreshTokenRepository {
  private readonly repo: Repository<RefreshTokenOrmEntity>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(RefreshTokenOrmEntity);
  }

  async save(token: RefreshToken): Promise<RefreshToken> {
    const existing = await this.repo.findOneBy({
      userId: token.userId,
      deviceId: token.deviceId,
    });
    if (existing) {
      await this.repo.delete(existing.id);
    }
    await this.repo.save(this.toOrm(token));
    return token;
  }

  async findById(id: string): Promise<RefreshToken | null> {
    const entity = await this.repo.findOneBy({ id });
    return entity ? this.toDomain(entity) : null;
  }

  async findByHash(hash: string): Promise<RefreshToken | null> {
    const entity = await this.repo.findOneBy({ hash });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<RefreshToken[]> {
    const entities = await this.repo.find({ order: { createdAt: "ASC" } });
    return entities.map((e) => this.toDomain(e));
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async deleteByHash(hash: string): Promise<void> {
    await this.repo.delete({ hash });
  }

  private toDomain(entity: RefreshTokenOrmEntity): RefreshToken {
    return RefreshToken.load({
      id: entity.id,
      userId: entity.userId,
      hash: entity.hash,
      expiresAt: entity.expiresAt,
      deviceId: entity.deviceId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private toOrm(token: RefreshToken): RefreshTokenOrmEntity {
    const entity = new RefreshTokenOrmEntity();
    entity.id = token.id;
    entity.userId = token.userId;
    entity.hash = token.hash;
    entity.expiresAt = token.expiresAt;
    entity.deviceId = token.deviceId;
    entity.createdAt = token.createdAt;
    entity.updatedAt = token.updatedAt;
    return entity;
  }
}
