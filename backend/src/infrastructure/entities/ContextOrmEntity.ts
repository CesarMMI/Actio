import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('contexts')
export class ContextOrmEntity {
  @PrimaryColumn('text')
  id!: string;

  @Column('text')
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column('boolean')
  active!: boolean;

  @Column('datetime')
  createdAt!: Date;
}
