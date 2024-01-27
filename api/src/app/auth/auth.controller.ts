import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthLoginDTO,
  AuthRegisterDTO,
  AuthTokenDTO,
  AuthUserDTO,
} from './auth.dto';
import { User } from '@/app/user/user.entity';
import { Public } from '@/shared/decorators/public.decorator';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/register')
  async signUp(@Body() body: AuthRegisterDTO): Promise<User> {
    return this.authService.register(body).catch((err) => {
      throw new HttpException(
        {
          message: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    });
  }

  @Public()
  @Post('/login')
  async signIn(@Body() body: AuthLoginDTO): Promise<AuthTokenDTO> {
    return this.authService.login(body);
  }

  @Get('/me')
  async getMe(@Req() request): Promise<AuthUserDTO> {
    const user = await this.authService.getUser(request.user.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.password) {
      delete user.password;
    }
    return {
      user: user,
    };
  }
}
