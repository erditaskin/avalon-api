import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';

@Module({
  imports: [UserModule],
  providers: [UserService],
  controllers: [AccountController],
  exports: [],
})
export class AccountModule {}
