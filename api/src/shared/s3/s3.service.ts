import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3ModuleOptions, S3ModuleOptionsFactory } from './s3.interfaces';

@Injectable()
export class S3Service implements S3ModuleOptionsFactory {
  constructor(private configService: ConfigService) {}

  public createS3ModuleOptions(): S3ModuleOptions | Promise<S3ModuleOptions> {
    return {
      config: {
        credentials: {
          accessKeyId: this.configService.get<string>('S3_ACCESS_KEY'),
          secretAccessKey: this.configService.get<string>('S3_SECRET_KEY'),
        },
        region: this.configService.get<string>('S3_REGION'),
        forcePathStyle: true,
        bucket: this.configService.get<string>('S3_BUCKET'),
      },
    };
  }
}
