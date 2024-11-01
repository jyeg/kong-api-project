import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ServiceGroup } from '../../service-group/entities/service-group.entity';
import { AuditableEntity } from '../../../common/entities';

@Entity()
export class Team extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToMany(() => User, (user) => user.teams)
  users: User[];

  @OneToMany(() => ServiceGroup, (service) => service.team)
  services: ServiceGroup[];
}
