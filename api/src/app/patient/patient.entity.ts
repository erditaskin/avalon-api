import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { PatientFile } from './files/patient-file.entity';

@Entity('patients')
export class Patient extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar' })
  public firstName: string;

  @Column({ type: 'varchar' })
  public lastName: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  public phone: string;

  @OneToMany(
    () => PatientFile,
    (patientFile: PatientFile) => patientFile.patient,
    {
      onDelete: 'SET NULL',
    },
  )
  public files: PatientFile[];

  @ManyToOne(() => User, (user: User) => user.patients, {
    onDelete: 'SET NULL',
  })
  public createdBy: User;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn({ nullable: true, default: null })
  public updatedAt: Date | null;
}
