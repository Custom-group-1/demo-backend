import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'trailblazer@astral.express', description: 'User email' })
  @IsEmail()     // Changed to generic string if you want to allow usernames too
  @IsNotEmpty()
  email: string; // Matches the field sent by api.ts

  @ApiProperty({ example: 'secret123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}