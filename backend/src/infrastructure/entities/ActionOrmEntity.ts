import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('actions')
export class ActionOrmEntity {
  @PrimaryColumn('text')
  id!: string;

  @Column('text')
  title!: string;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @Column({ type: 'datetime', nullable: true })
  dueDate!: Date | null;

  @Column({ type: 'text', nullable: true })
  timeBucket!: string | null;

  @Column({ type: 'text', nullable: true })
  energyLevel!: string | null;

  @Column('text')
  status!: string;

  @Column({ type: 'text', nullable: true })
  projectId!: string | null;

  @Column({ type: 'text', nullable: true })
  contextId!: string | null;

  @Column('datetime')
  createdAt!: Date;
}
