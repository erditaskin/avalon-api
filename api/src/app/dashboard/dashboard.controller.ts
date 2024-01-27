import { Controller, Get } from '@nestjs/common';
import { UserService } from '@/app/user/user.service';
import { PatientService } from '@/app/patient/patient.service';
import { PatientFileService } from '@/app/patient/files/patient-file.service';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly patientService: PatientService,
    private readonly patientFileService: PatientFileService,
    private readonly userService: UserService,
  ) {}

  @Get('stats')
  public async stats(): Promise<any> {
    return {
      users: await this.userService.count(),
      patients: await this.patientService.count(),
      patientFiles: await this.patientFileService.count(),
      appointments: 0,
    };
  }
}
