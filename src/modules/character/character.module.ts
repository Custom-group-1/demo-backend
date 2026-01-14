import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CharacterController } from './character.controller';
import { Character } from '../../entities/User';

@Module({
  imports: [MikroOrmModule.forFeature([Character])],
  controllers: [CharacterController],
})
export class CharacterModule {}
