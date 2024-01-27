import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PatientFileService } from './patient-file.service';
import { Patient } from '@/app/patient/patient.entity';
import { PatientService } from '../patient.service';
import { CreatePatientFileDto } from './patient-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from '@/app/user/user.service';
import { Public } from '@/shared/decorators/public.decorator';
import { PatientFile } from './patient-file.entity';

@Controller('/patient/file')
export class PatientFileController {
  constructor(
    private patientFileService: PatientFileService,
    private patientService: PatientService,
    private userService: UserService,
  ) {}

  @Public()
  @Get('list/:id')
  public async list(
    @Param('id', ParseIntPipe) id: number,
    @Res() response,
  ): Promise<Response | never> {
    try {
      const patient = await this.patientService.findOne(id);
      if (patient instanceof Patient) {
        const data = await this.patientFileService.findAll(patient);
        return response.status(HttpStatus.OK).send(data);
      }
      return response.status(HttpStatus.NOT_FOUND).send('Not Found');
    } catch (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
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

  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  public async create(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreatePatientFileDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /(jpg|jpeg|png|pdf)$/ })
        .addMaxSizeValidator({
          maxSize: 1000 * 100 * 10 * 5,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Req() request,
    @Res() response,
  ): Promise<Response | never> {
    try {
      const patient = await this.patientService.findOne(id);
      if (patient instanceof Patient) {
        body.file = file;
        const user = await this.userService.findOne(request.user.id);
        const data = await this.patientFileService.upload(body, patient, user);
        return response.status(HttpStatus.OK).send({ data, success: true });
      }
      return response.status(HttpStatus.NOT_FOUND).send('Not Found');
    } catch (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @Delete('delete/:id')
  public async delete(
    @Param('id', ParseIntPipe) id: number,
    @Res() response,
  ): Promise<Response | never> {
    try {
      const data = await this.patientFileService.findOne(id);
      if (data instanceof PatientFile) {
        const deleted = await this.patientFileService.delete(data);
        return response.status(HttpStatus.OK).send({ deleted, success: true });
      }

      return response.status(HttpStatus.NOT_FOUND).send('Not Found');
    } catch (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }
}
