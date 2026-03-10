import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('tasks')
export class TaskOrmEntity {
  @PrimaryColumn('text')
  id!: string;

  @Column('text')
  description!: string;

  @Column({ type: 'text', nullable: true })
  contextId!: string | null;

  @Column({ type: 'text', nullable: true })
  projectId!: string | null;

  @Column({ type: 'text', nullable: true })
  parentTaskId!: string | null;

  @Column({ type: 'text', nullable: true })
  childTaskId!: string | null;

  @Column('datetime')
  createdAt!: Date;

  @Column('datetime')
  updatedAt!: Date;
}
