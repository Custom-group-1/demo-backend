import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PathController } from './path.controller';
import { Path } from '../../entities/User';

@Module({
  imports: [MikroOrmModule.forFeature([Path])],
  controllers: [PathController],
})
export class PathModule {}