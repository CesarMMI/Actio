import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';
import { ProjectOrmEntity } from './project.orm-entity';
import { ContextOrmEntity } from './context.orm-entity';

@Entity('actions')
export class ActionOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserOrmEntity;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'datetime', nullable: true })
  dueDate: Date | null;

  @Column({ type: 'varchar', nullable: true })
  timeBucket: string | null;

  @Column({ type: 'varchar', nullable: true })
  energyLevel: string | null;

  @Column({ type: 'uuid', nullable: true })
  projectId: string | null;

  @ManyToOne(() => ProjectOrmEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'projectId' })
  project: ProjectOrmEntity;

  @Column({ type: 'uuid', nullable: true })
  contextId: string | null;

  @ManyToOne(() => ContextOrmEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'contextId' })
  context: ContextOrmEntity;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'datetime', nullable: true })
  completedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
