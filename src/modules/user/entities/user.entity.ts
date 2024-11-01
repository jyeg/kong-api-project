import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Team } from '../../team/entities/team.entity';
import { AuditableEntity } from '../../../common/entities';
import { Role } from '../../../common/interfaces';

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

  @ManyToMany(() => Team, (team) => team.users)
  @JoinTable({
    name: 'user_teams',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'team_id', referencedColumnName: 'id' },
  })
  teams: Team[];
}
