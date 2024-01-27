import { Global, Module } from '@nestjs/common';
import { HashService } from './services/hash.service';
import { ConfigModule } from '@nestjs/config';
import { S3Module } from './s3/s3.module';
import { S3Service } from './s3/s3.service';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    S3Module.forRootAsync({ imports: [ConfigModule], useClass: S3Service }),
  ],
  providers: [HashService],
  exports: [HashService],
})
@Global()
export class SharedModule {}
