import { IsString, IsEmail, IsEnum, MinLength, MaxLength } from 'class-validator';
import { UserRole } from '../../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MaxLength(400)
  address: string;

  @IsEnum(UserRole)
  role: UserRole;
}
