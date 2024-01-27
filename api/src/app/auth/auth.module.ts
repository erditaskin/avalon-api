import { Module } from '@nestjs/common';
import { UserModule } from '@/app/user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Module({
  imports: [
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
    UserModule,
    ConfigModule,
  ],
  providers: [UserService, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
