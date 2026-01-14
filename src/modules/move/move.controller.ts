import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import {
  EntityRepository,
  QueryOrder,
  FilterQuery,
} from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Move, MoveType } from '../../entities/User';
import { MoveResponseDto } from './dto/move-response.dto';

@ApiTags('Move Management')
@Controller('move')
export class MoveController {
  constructor(
    @InjectRepository(Move)
    private readonly moveRepository: EntityRepository<Move>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all moves' })
  @ApiResponse({
    status: 200,
    description: 'Found moves',
    type: [MoveResponseDto],
  })
  @ApiQuery({ name: 'characterId', required: false, type: Number })
  @ApiQuery({ name: 'moveType', required: false, enum: MoveType })
  async find(
    @Query('characterId') characterId?: string,
    @Query('moveType') moveType?: MoveType,
  ) {
    const where: FilterQuery<Move> = {};

    if (characterId) {
      where.character = { characterId: parseInt(characterId) };
    }

    if (moveType) {
      where.moveType = moveType;
    }

    const moves = await this.moveRepository.find(where, {
      populate: ['character'],
      orderBy: { moveId: QueryOrder.ASC },
    });
    return moves.map((move) => new MoveResponseDto(move));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single move by ID' })
  @ApiResponse({
    status: 200,
    description: 'The found move',
    type: MoveResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Move not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const move = await this.moveRepository.findOne(
      { moveId: id },
      { populate: ['character'] },
    );

    if (!move) {
      throw new HttpException(
        `Move with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return new MoveResponseDto(move);
  }
}
