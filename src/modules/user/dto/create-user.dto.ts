import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  // --- ADD THIS ---
  @ApiProperty({ example: 'secret123', description: 'Plain text password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}