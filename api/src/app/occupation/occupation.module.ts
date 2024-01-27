import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Occupation } from './occupation.entity';
import { OccupationService } from './occupation.service';
import { OccupationController } from './occupation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Occupation])],
  providers: [OccupationService],
  controllers: [OccupationController],
  exports: [TypeOrmModule],
})
export class OccupationModule {}
