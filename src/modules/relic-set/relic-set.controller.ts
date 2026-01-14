import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EntityRepository, QueryOrder } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { RelicSet } from '../../entities/User';
import { RelicSetResponseDto } from './dto/relic-set-response.dto';

@ApiTags('Relic Set Management')
@Controller('relic-set')
export class RelicSetController {
  constructor(
    @InjectRepository(RelicSet)
    private readonly relicSetRepository: EntityRepository<RelicSet>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all relic sets' })
  @ApiResponse({
    status: 200,
    description: 'Found relic sets',
    type: [RelicSetResponseDto],
  })
  async find() {
    const relicSets = await this.relicSetRepository.findAll({
      orderBy: { name: QueryOrder.ASC },
    });
    return relicSets.map((relicSet) => new RelicSetResponseDto(relicSet));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single relic set by ID' })
  @ApiResponse({
    status: 200,
    description: 'The found relic set',
    type: RelicSetResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Relic set not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const relicSet = await this.relicSetRepository.findOne({ relicId: id });

    if (!relicSet) {
      throw new HttpException(
        `Relic set with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return new RelicSetResponseDto(relicSet);
  }
}
