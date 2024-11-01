import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ServiceGroup } from '../../service-group/entities/service-group.entity';
import { AuditableEntity } from '../../../common/entities';

@Entity('versions')
export class Version extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ServiceGroup, (service) => service.versions, {
    onDelete: 'CASCADE',
  })
  service: ServiceGroup;

  @Column({ length: 50 })
  versionNumber: string;

  @Column({ type: 'date', nullable: true })
  releaseDate: Date;

  @Column({ type: 'text', nullable: true })
  changelog: string;

  @Column({ length: 255, nullable: true })
  documentationUrl: string;
}
