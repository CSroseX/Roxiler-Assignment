import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateStoreDto {
	@IsOptional()
	@IsString()
	@MaxLength(60)
	name?: string;

	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@IsString()
	@MaxLength(400)
	address?: string;
}
