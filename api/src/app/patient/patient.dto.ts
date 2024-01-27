import { IsString, IsOptional } from 'class-validator';

// DTOs
export class CreatePatientDto {
  @IsString()
  public readonly firstName: string;

  @IsString()
  public readonly lastName: string;

  @IsString()
  public readonly phone: string;
}

export class UpdatePatientDto {
  @IsOptional()
  @IsString()
  public readonly firstName: string;

  @IsOptional()
  @IsString()
  public readonly lastName: string;

  @IsOptional()
  @IsString()
  public readonly phone: string;
}
