import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyCodeDto {
  @ApiProperty({ example: 'trailblazer@astral.express' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456', description: 'The 6-digit verification code' })
  @IsString()
  @IsNotEmpty()
  // Assuming code is 6 digits? Remove Length decorator if it varies.
  @Length(4, 10) 
  code: string;
}