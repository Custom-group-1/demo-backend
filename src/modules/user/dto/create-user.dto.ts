import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  // --- ADD THIS SECTION ---
  @ApiProperty({ example: 'trailblazer@astral.express' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  // ------------------------

  @ApiProperty({ example: 'secret123', description: 'Plain text password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
