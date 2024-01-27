import { IsNumber, IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  public readonly firstName: string;

  @IsString()
  public readonly lastName: string;

  @IsNumber()
  public readonly occupation_id: number;

  @IsString()
  @IsEmail()
  public readonly email: string;

  @MinLength(8)
  @IsString()
  public readonly password: string;
}
