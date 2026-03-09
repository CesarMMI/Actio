import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('projects')
export class ProjectOrmEntity {
  @PrimaryColumn('text')
  id!: string;

  @Column('text')
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column('text')
  status!: string;

  @Column('datetime')
  createdAt!: Date;
}
