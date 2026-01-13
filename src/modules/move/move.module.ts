import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MoveController } from './move.controller';
import { Move } from '../../entities/User';

@Module({
  imports: [MikroOrmModule.forFeature([Move])],
  controllers: [MoveController],
})
export class MoveModule {}