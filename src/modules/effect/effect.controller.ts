import { Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { EntityRepository, QueryOrder, FilterQuery } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Effect, EffectType } from '../../entities/User';
import { EffectResponseDto } from './dto/effect-response.dto';

@ApiTags('Effect Management')
@Controller('effect')
export class EffectController {
  constructor(
    @InjectRepository(Effect) private readonly effectRepository: EntityRepository<Effect>,
  ) { }

  @Get()
  @ApiOperation({ summary: 'List all effects' })
  @ApiResponse({ status: 200, description: 'Found effects', type: [EffectResponseDto] })
  @ApiQuery({ name: 'effectType', required: false, enum: EffectType })
  @ApiQuery({ name: 'sourceType', required: false, type: String })
  @ApiQuery({ name: 'sourceId', required: false, type: Number })
  async find(
    @Query('effectType') effectType?: EffectType,
    @Query('sourceType') sourceType?: string,
    @Query('sourceId') sourceId?: string,
  ) {
    let where: FilterQuery<Effect> = {};

    if (effectType) {
      where.effectType = effectType;
    }

    if (sourceType && sourceId) {
      const sourceIdNum = parseInt(sourceId);
      switch (sourceType) {
        case 'move':
          where.move = { moveId: sourceIdNum };
          break;
        case 'relic_move':
          where.relicMove = { relicMoveId: sourceIdNum };
          break;
        case 'lightcone_move':
          where.lcMove = { lcMoveId: sourceIdNum };
          break;
        case 'eidolon':
          where.eidolon = { eidolonId: sourceIdNum };
          break;
        case 'trace':
          where.trace = { traceId: sourceIdNum };
          break;
      }
    }

    const effects = await this.effectRepository.find(where, {
      populate: ['move', 'relicMove', 'lcMove', 'eidolon', 'trace'],
      orderBy: { effectId: QueryOrder.ASC },
    });
    return effects.map(effect => new EffectResponseDto(effect));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single effect by ID' })
  @ApiResponse({ status: 200, description: 'The found effect', type: EffectResponseDto })
  @ApiResponse({ status: 404, description: 'Effect not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const effect = await this.effectRepository.findOne({ effectId: id }, {
      populate: ['move', 'relicMove', 'lcMove', 'eidolon', 'trace']
    });

    if (!effect) {
      throw new HttpException(`Effect with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return new EffectResponseDto(effect);
  }
}