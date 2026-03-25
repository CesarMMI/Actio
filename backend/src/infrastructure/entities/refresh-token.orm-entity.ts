import { Column, Entity, PrimaryColumn, Unique } from "typeorm";

@Entity("refresh_tokens")
@Unique(["userId", "deviceId"])
export class RefreshTokenOrmEntity {
  @PrimaryColumn("text")
  id!: string;

  @Column("text")
  userId!: string;

  @Column("text")
  hash!: string;

  @Column("datetime")
  expiresAt!: Date;

  @Column("text")
  deviceId!: string;

  @Column("datetime")
  createdAt!: Date;

  @Column("datetime")
  updatedAt!: Date;
}
