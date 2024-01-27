import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.get<string>('POSTGRES_DB_HOST'),
      port: this.config.get<number>('POSTGRES_DB_PORT'),
      database:
        this.config.get<string>('POSTGRES_DB_PREFIX') +
        '_' +
        this.config.get<string>('POSTGRES_DB_NAME'),
      username: this.config.get<string>('POSTGRES_USER'),
      password: this.config.get<string>('POSTGRES_PASSWORD'),
      entities: ['dist/**/*.entity.{ts,js}'],
      subscribers: ['dist/**/*.subscriber.{ts,js}'],
      migrations: ['dist/migrations/*.{ts,js}'],
      logger: 'file',
      autoLoadEntities: true,
      synchronize: this.config.get<string>('APP_ENV') == 'dev' ? true : false,
    };
  }
}
