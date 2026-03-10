import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('contexts')
export class ContextOrmEntity {
  @PrimaryColumn('text')
  id!: string;

  @Column('text')
  title!: string;

  @Column('datetime')
  createdAt!: Date;

  @Column('datetime')
  updatedAt!: Date;
}
