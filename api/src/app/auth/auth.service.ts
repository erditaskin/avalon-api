import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/app/user/user.service';
import {
  AuthLoginDTO,
  AuthRegisterDTO,
  AuthTokenDTO,
  AuthTokenPayloadDTO,
} from './auth.dto';
import { User } from '@/app/user/user.entity';
import { HashService } from '@/shared/services/hash.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private hashService: HashService,
    private jwtService: JwtService,
  ) {}

  async getUser(id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  async register(body: AuthRegisterDTO): Promise<User> {
    return this.userService.create(body);
  }

  async login(body: AuthLoginDTO): Promise<AuthTokenDTO> {
    const { email, password } = body;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    if (!this.hashService.checkHash(password, user.password)) {
      throw new UnauthorizedException();
    }

    const authTokenPayload: AuthTokenPayloadDTO = {
      id: user.id,
      user: user,
    };
    const token = await this.jwtService.signAsync(authTokenPayload);

    return { token };
  }
}
