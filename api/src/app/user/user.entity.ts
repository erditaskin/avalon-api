import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UserRole } from '@/shared/enums/role.enum';
import { Occupation } from '../occupation/occupation.entity';
import { Patient } from '../patient/patient.entity';
import { PatientFile } from '../patient/files/patient-file.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar' })
  public firstName: string;

  @Column({ type: 'varchar' })
  public lastName: string;

  @ManyToOne(() => Occupation, (occupation: Occupation) => occupation.users, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  public occupation: Occupation;

  @OneToMany(() => Patient, (patient: Patient) => patient.createdBy, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  public patients: Patient[];

  @OneToMany(
    () => PatientFile,
    (patientFile: PatientFile) => patientFile.createdBy,
    {
      onDelete: 'SET NULL',
    },
  )
  @JoinColumn()
  public patientFiles: PatientFile[];

  @Column({ type: 'varchar', nullable: true, default: null })
  public avatar: string | null;

  @Column({ type: 'varchar', unique: true })
  public email: string;

  @Exclude()
  @Column({ type: 'varchar' })
  public password!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  public role: UserRole;

  @Column({ type: 'boolean', nullable: true, default: true })
  public isActive: boolean;

  @Column({ type: 'timestamp', nullable: true, default: null })
  public lastLoginAt: Date | null;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn({ nullable: true, default: null })
  public updatedAt: Date | null;
}
