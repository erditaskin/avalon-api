import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { OccupationModule } from './occupation/occupation.module';
import { AccountModule } from './account/account.module';
import { PatientModule } from './patient/patient.module';
import { DashboardController } from './dashboard/dashboard.controller';

@Module({
  imports: [
    AccountModule,
    AuthModule,
    UserModule,
    OccupationModule,
    PatientModule,
  ],
  controllers: [DashboardController],
})
export class AppModule {}
