import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Team } from '../../team/entities/team.entity';
import { AuditableEntity } from '../../../common/entities';
import { Role } from '../../../common/interfaces';
import { ServiceGroup } from '../../service-group/entities/service-group.entity';

@Entity('users')
export class User extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, unique: true })
  username: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column('simple-array')
  roles: Role[];

  @ManyToOne(() => Team, (team) => team.users, { nullable: true })
  team: Team;

  @Column('uuid')
  teamId: string;

  @OneToMany(() => ServiceGroup, (service) => service.user)
  services: ServiceGroup[];
}
