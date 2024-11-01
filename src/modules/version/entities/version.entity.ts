import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ServiceGroup } from '../../service-group/entities/service-group.entity';

@Entity('versions')
export class Version {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ServiceGroup, (service) => service.versions, {
    onDelete: 'CASCADE',
  })
  service: ServiceGroup;

  @Column({ length: 50 })
  version_number: string;

  @Column({ type: 'date', nullable: true })
  release_date: Date;

  @Column({ type: 'text', nullable: true })
  changelog: string;

  @Column({ length: 255, nullable: true })
  documentation_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
