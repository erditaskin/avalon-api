import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { Patient } from '@/app/patient/patient.entity';
import { UserService } from '../user/user.service';
import { CreatePatientDto, UpdatePatientDto } from './patient.dto';

@Controller('/patient')
export class PatientController {
  constructor(
    private patientService: PatientService,
    private userService: UserService,
  ) {}

  @Get('/list')
  list(): Promise<Patient[]> {
    return this.patientService.findAll();
  }

  @Get('show/:id')
  public async show(
    @Param('id', ParseIntPipe) id: number,
    @Res() response,
  ): Promise<Response | never> {
    try {
      const data = await this.patientService.findOne(id);
      return response.status(HttpStatus.OK).send(data);
    } catch (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @Post('create')
  public async create(
    @Body() body: CreatePatientDto,
    @Req() request,
    @Res() response,
  ): Promise<Response | never> {
    try {
      const user = await this.userService.findOne(request.user.id);
      const create = this.patientService.create(body, user);

      return response.status(HttpStatus.OK).send({ create, success: true });
    } catch (error) {
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  @Put('update/:id')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePatientDto,
    @Res() response,
  ): Promise<Response | never> {
    try {
      const data = await this.patientService.findOne(id);

      if (data instanceof Patient) {
        const update = await this.patientService.update(body, data);

        return response.status(HttpStatus.OK).send({ update, success: true });
      }

      return response.status(HttpStatus.NOT_FOUND).send('Not Found');
    } catch (error) {
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  @Delete('delete/:id')
  public async delete(
    @Param('id', ParseIntPipe) id: number,
    @Res() response,
  ): Promise<Response | never> {
    try {
      const data = await this.patientService.findOne(id);

      if (data instanceof Patient) {
        const deleted = await this.patientService.delete(data);
        return response.status(HttpStatus.OK).send({ deleted, success: true });
      }

      return response.status(HttpStatus.NOT_FOUND).send('Not Found');
    } catch (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }
}
