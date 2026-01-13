import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EffectController } from './effect.controller';
import { Effect } from '../../entities/User';

@Module({
  imports: [MikroOrmModule.forFeature([Effect])],
  controllers: [EffectController],
})
export class EffectModule {}