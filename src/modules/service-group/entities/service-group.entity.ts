import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Team } from '../../team/entities/team.entity';
import { Version } from '../../version/entities/version.entity';
import { AuditableEntity } from '../../../common/entities';

@Entity('service_groups')
export class ServiceGroup extends AuditableEntity {
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

  // @Column({
  //   type: 'tsvector',
  //   nullable: true,

  // })
  // fullTextSearch: string;

  @Column({ length: 50, nullable: true })
  status: string;

  @OneToMany(() => Version, (version) => version.service)
  versions: Version[];
}
