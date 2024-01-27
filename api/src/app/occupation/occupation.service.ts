import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Occupation } from '@/app/occupation/occupation.entity';

@Injectable()
export class OccupationService {
  constructor(
    @InjectRepository(Occupation)
    private readonly repository: Repository<Occupation>,
  ) {}

  findAll(): Promise<Occupation[]> {
    return this.repository.find();
  }

  async seedData(): Promise<Occupation[]> {
    const data = await this.findAll();
    if (data.length === 0) {
      const seedData: Partial<Occupation>[] = [
        { name: 'Doctor' },
        { name: 'Nurse' },
      ];
      return await this.repository.save(seedData);
    } else {
      return data;
    }
  }
}
