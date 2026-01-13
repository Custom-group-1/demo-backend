import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  // --- ADD THIS ---
  @ApiProperty({ example: 'newSecret123', required: false })
  @IsString()
  @IsOptional()
  password?: string;
}