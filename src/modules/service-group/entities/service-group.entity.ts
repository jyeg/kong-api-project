import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
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

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.services, { onDelete: 'SET NULL' })
  user: User;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @OneToMany(() => Version, (version) => version.serviceGroup, {
    cascade: ['insert', 'update', 'soft-remove'],
  })
  versions: Version[];
}
