import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { ServiceGroup } from '../../service-group/entities/service-group.entity';
import { AuditableEntity } from '../../../common/entities';

@Entity('versions')
@Index('IDX_UNIQUE_ACTIVE_VERSION', ['service', 'isActive'], {
  unique: true,
  where: 'is_active = true',
})
export class Version extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ServiceGroup, (service) => service.versions, {
    onDelete: 'CASCADE',
  })
  service: ServiceGroup;

  @Column('uuid')
  serviceId: string;

  @Column({ type: 'integer' })
  version: number;

  @Column({ type: 'date', nullable: true })
  releaseDate: Date;

  @Column({ type: 'jsonb', nullable: false, default: {} })
  changelog: string;

  @Column({ length: 255, nullable: true })
  documentationUrl: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;
}
