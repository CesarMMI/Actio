import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('projects')
export class ProjectOrmEntity {
  @PrimaryColumn('text')
  id!: string;

  @Column('text')
  title!: string;

  @Column('datetime')
  createdAt!: Date;

  @Column('datetime')
  updatedAt!: Date;
}
