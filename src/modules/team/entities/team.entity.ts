import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ServiceGroup } from '../../service-group/entities/service-group.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => User, (user) => user.teams)
  users: User[];

  @OneToMany(() => ServiceGroup, (service) => service.team)
  services: ServiceGroup[];
}
