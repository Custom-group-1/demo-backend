import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserController } from './user.controller';
import { User } from '../../entities/User';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [UserController],
})
export class UserModule {}
