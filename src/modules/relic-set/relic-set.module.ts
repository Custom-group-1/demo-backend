import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { RelicSetController } from './relic-set.controller';
import { RelicSet } from '../../entities/User';

@Module({
  imports: [MikroOrmModule.forFeature([RelicSet])],
  controllers: [RelicSetController],
})
export class RelicSetModule {}