import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../../entities/User';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MikroOrmModule.forFeature([User]), // Access to User Repo
    PassportModule,
    JwtModule.register({
      secret: 'YOUR_SECRET_KEY', // SECURITY: Use env vars here
      signOptions: { expiresIn: '60m' }, // Token expires in 60 minutes
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}