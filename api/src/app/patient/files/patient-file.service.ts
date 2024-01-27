import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '@/app/patient/patient.entity';
import { PatientFile } from './patient-file.entity';
import { CreatePatientFileDto } from './patient-file.dto';
import { User } from '@/app/user/user.entity';
import { InjectS3, S3 } from '@/shared/s3/';

@Injectable()
export class PatientFileService {
  @InjectS3()
  private readonly s3: S3;

  constructor(
    @InjectRepository(PatientFile)
    private readonly repository: Repository<PatientFile>,
  ) {}

  public async count(): Promise<number> {
    return await this.repository.countBy({});
  }

  public async findAll(patient: Patient): Promise<PatientFile[]> {
    return await this.repository.find({
      where: { patient: { id: patient.id } },
      relations: ['createdBy', 'patient'],
    });
  }

  public async findOne(id: number): Promise<PatientFile> {
    return await this.repository.findOne({
      where: { id },
      relations: ['createdBy', 'patient'],
    });
  }

  public async upload(
    body: CreatePatientFileDto,
    patient: Patient,
    user: User,
  ): Promise<PatientFile> {
    const patientFile = new PatientFile();

    const ext = body.file?.originalname?.split('.').pop();
    const uid = Math.random().toString(36).substring(2, 36);
    const fileName = `files/${patient.id}/file-${uid}.${ext}`;

    await this.s3.putObject({
      ACL: 'public-read',
      Bucket: this.s3.config['bucket'],
      Key: fileName,
      Body: body.file.buffer,
    });

    patientFile.patient = patient;
    patientFile.createdBy = user;
    patientFile.fileName = fileName;
    patientFile.note = body.note;

    return await this.repository.save(patientFile);
  }

  public async delete(entity: PatientFile): Promise<PatientFile | any> {
    try {
      return await this.repository.remove(entity);
    } catch {
      throw new HttpException('PatientFile not found', 404);
    }
  }
}
