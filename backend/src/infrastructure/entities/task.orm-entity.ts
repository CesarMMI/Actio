import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('tasks')
export class TaskOrmEntity {
  @PrimaryColumn('text')
  id!: string;

  @Column('text')
  description!: string;

  @Column('boolean')
  done!: boolean;

  @Column({ type: 'datetime', nullable: true })
  doneAt!: Date | null;

  @Column({ type: 'text', nullable: true })
  contextId!: string | null;

  @Column({ type: 'text', nullable: true })
  projectId!: string | null;

  @Column('datetime')
  createdAt!: Date;

  @Column('datetime')
  updatedAt!: Date;
}
