import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('captured_items')
export class CapturedItemOrmEntity {
  @PrimaryColumn('text')
  id!: string;

  @Column('text')
  title!: string;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @Column('text')
  status!: string;

  @Column('datetime')
  createdAt!: Date;
}
