import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("users")
export class UserOrmEntity {
  @PrimaryColumn("text")
  id!: string;

  @Column({ type: "text", unique: true })
  email!: string;

  @Column("text")
  passwordHash!: string;

  @Column("text")
  role!: string;

  @Column({ type: "text", nullable: true })
  name!: string | null;

  @Column("datetime")
  createdAt!: Date;

  @Column("datetime")
  updatedAt!: Date;
}
