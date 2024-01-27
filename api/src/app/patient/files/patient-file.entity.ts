import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@/app/user/user.entity';
import { Patient } from '../patient.entity';

@Entity('patientFiles')
export class PatientFile extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar' })
  public note: string;

  @Column({ type: 'varchar' })
  public fileName: string;

  @ManyToOne(() => Patient, (patient: Patient) => patient.files, {
    onDelete: 'SET NULL',
  })
  public patient: Patient;

  @ManyToOne(() => User, (user: User) => user.patientFiles, {
    onDelete: 'SET NULL',
  })
  public createdBy: User;

  @CreateDateColumn()
  public createdAt: Date;
}
