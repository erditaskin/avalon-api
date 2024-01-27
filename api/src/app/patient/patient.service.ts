import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '@/app/patient/patient.entity';
import { User } from '../user/user.entity';
import { CreatePatientDto, UpdatePatientDto } from './patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly repository: Repository<Patient>,
  ) {}

  public async count(): Promise<number> {
    return await this.repository.countBy({});
  }

  public async findAll(): Promise<Patient[]> {
    return this.repository.find({ relations: ['createdBy'] });
  }

  public async findOne(id: number): Promise<Patient> {
    return await this.repository.findOne({
      where: { id },
      relations: ['createdBy'],
    });
  }
  public async create(body: CreatePatientDto, user: User): Promise<Patient> {
    const entity = new Patient();
    entity.createdBy = user;
    entity.firstName = body.firstName;
    entity.lastName = body.lastName;
    entity.phone = body.phone;

    return await this.repository.save(entity);
  }

  public async update(
    body: UpdatePatientDto,
    entity: Patient,
  ): Promise<Patient> {
    entity.firstName = body.firstName;
    entity.lastName = body.lastName;
    entity.phone = body.phone;
    return await this.repository.save(entity);
  }

  public async delete(entity: Patient): Promise<Patient | any> {
    try {
      return await this.repository.remove(entity);
    } catch {
      throw new HttpException('Patient not found', 404);
    }
  }
}
