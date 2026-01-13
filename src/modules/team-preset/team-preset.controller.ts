import { Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EntityRepository, QueryOrder } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { TeamPreset } from '../../entities/User';
import { TeamPresetResponseDto } from './dto/team-preset-response.dto';

@ApiTags('Team Preset Management')
@Controller('team-presets')
export class TeamPresetController {
  constructor(
    @InjectRepository(TeamPreset) private readonly teamPresetRepository: EntityRepository<TeamPreset>,
  ) { }

  @Get()
  @ApiOperation({ summary: 'List all team presets' })
  @ApiResponse({ status: 200, type: [TeamPresetResponseDto] })
  async find() {
    const presets = await this.teamPresetRepository.findAll({
      populate: ['members', 'members.character', 'members.lightcone', 'user'],
      orderBy: { presetId: QueryOrder.ASC },
    });
    return presets.map(preset => new TeamPresetResponseDto(preset));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single team preset' })
  @ApiResponse({ status: 200, type: TeamPresetResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const preset = await this.teamPresetRepository.findOne(
      { presetId: id },
      { 
        populate: ['members', 'members.character', 'members.lightcone', 'user'],
        orderBy: { members: { slotIndex: QueryOrder.ASC } }
      }
    );

    if (!preset) throw new HttpException(`Preset ${id} not found`, HttpStatus.NOT_FOUND);
    return new TeamPresetResponseDto(preset);
  }
}