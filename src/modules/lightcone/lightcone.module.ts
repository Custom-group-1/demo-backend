import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { LightconeController } from './lightcone.controller';
import { Lightcone } from '../../entities/User';

@Module({
  imports: [MikroOrmModule.forFeature([Lightcone])],
  controllers: [LightconeController],
})
export class LightconeModule {}
