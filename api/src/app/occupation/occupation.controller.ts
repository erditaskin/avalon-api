import { Controller, Get } from '@nestjs/common';
import { OccupationService } from './occupation.service';
import { Occupation } from '@/app/occupation/occupation.entity';
import { Public } from '@/shared/decorators/public.decorator';

@Controller('/occupation')
export class OccupationController {
  constructor(private occupationService: OccupationService) {}

  @Public()
  @Get('/list')
  list(): Promise<Occupation[]> {
    return this.occupationService.findAll();
  }

  @Get('/seed')
  async seed(): Promise<string> {
    await this.occupationService.seedData();
    return 'Database seeded successfully!';
  }
}
