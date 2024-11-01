import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export abstract class AuditableEntity {
  @CreateDateColumn({ nullable: false })
  createdAt: Date;

  @Column({ nullable: false, default: 'system' })
  createdBy: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: false, default: 'system' })
  updatedBy: string;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
