import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
