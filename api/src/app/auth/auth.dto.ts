import { IsString, IsEmail, MinLength, IsNumber } from 'class-validator';
import { User } from '../user/user.entity';

export class AuthLoginDTO {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}

export class AuthRegisterDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNumber()
  occupation_id: number;

  @IsString()
  @IsEmail()
  email: string;

  @MinLength(6)
  @IsString()
  password: string;
}

export class AuthTokenDTO {
  token: string;
}

export class AuthUserDTO {
  user: Partial<User>;
}

export interface AuthTokenPayloadDTO {
  id: number;
  user: User;
}
