import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Team } from '../../team/entities/team.entity';
import { Version } from '../../version/entities/version.entity';

@Entity('service_groups')
export class ServiceGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Team, (team) => team.services, { onDelete: 'SET NULL' })
  team: Team;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column({ length: 50, nullable: true })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Version, (version) => version.service)
  versions: Version[];
}
