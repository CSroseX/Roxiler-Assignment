import { IsString, IsEmail, MinLength, MaxLength, Matches } from 'class-validator';
import { UserRole } from '../../entities/user.entity';

export class RegisterDto {
  @IsString()
  @MinLength(20)
  @MaxLength(60)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/, {
    message: 'Password must contain at least 1 uppercase letter and 1 special character'
  })
  password: string;

  @IsString()
  @MaxLength(400)
  address: string;

  role: UserRole;
}