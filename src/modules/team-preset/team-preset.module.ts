import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TeamPresetController } from './team-preset.controller';
import { TeamPreset, TeamMember } from '../../entities/User';

@Module({
  imports: [MikroOrmModule.forFeature([TeamPreset, TeamMember])],
  controllers: [TeamPresetController],
})
export class TeamPresetModule {}
