import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'trailblazer@astral.express', description: 'The email to send the code to' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}