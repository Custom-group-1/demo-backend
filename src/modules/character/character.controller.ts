import { Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EntityRepository, QueryOrder } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Character } from '../../entities/User';
import { CharacterResponseDto } from './dto/character-response.dto';

@ApiTags('Character Management')
@Controller('character')
export class CharacterController {
  constructor(
    @InjectRepository(Character) private readonly characterRepository: EntityRepository<Character>,
  ) { }

  @Get()
  @ApiOperation({ summary: 'List all characters' })
  @ApiResponse({ status: 200, description: 'Found characters', type: [CharacterResponseDto] })
  async find() {
    const characters = await this.characterRepository.findAll({
      populate: ['path'],
      orderBy: { name: QueryOrder.ASC },
    });
    return characters.map(character => new CharacterResponseDto(character));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single character by ID' })
  @ApiResponse({ status: 200, description: 'The found character', type: CharacterResponseDto })
  @ApiResponse({ status: 404, description: 'Character not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const character = await this.characterRepository.findOne({ characterId: id }, { populate: ['path'] });

    if (!character) {
      throw new HttpException(`Character with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return new CharacterResponseDto(character);
  }
}