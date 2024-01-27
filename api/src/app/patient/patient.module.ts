import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './patient.entity';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { UserModule } from '../user/user.module';
import { PatientFileService } from './files/patient-file.service';
import { PatientFile } from './files/patient-file.entity';
import { PatientFileController } from './files/patient-file.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, PatientFile]), UserModule],
  providers: [PatientService, PatientFileService],
  controllers: [PatientController, PatientFileController],
  exports: [TypeOrmModule, PatientService, PatientFileService],
})
export class PatientModule {}
