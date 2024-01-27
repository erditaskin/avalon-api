import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './shared/config/database/typeorm.config';
import { AppModule } from '@/app/app.module';
import { SharedModule } from '@/shared/shared.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './app/auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        global: true,
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
    // Relational DB Connection
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfig }),
    AppModule,
    SharedModule,
  ],
  // Roles should be accessible everywhere.
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class CoreModule {}
