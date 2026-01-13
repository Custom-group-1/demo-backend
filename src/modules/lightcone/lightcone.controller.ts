import { Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EntityRepository, QueryOrder } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Lightcone } from '../../entities/User';
import { LightconeResponseDto } from './dto/lightcone-response.dto';

@ApiTags('Lightcone Management')
@Controller('lightcone')
export class LightconeController {
  constructor(
    @InjectRepository(Lightcone) private readonly lightconeRepository: EntityRepository<Lightcone>,
  ) { }

  @Get()
  @ApiOperation({ summary: 'List all lightcones' })
  @ApiResponse({ status: 200, description: 'Found lightcones', type: [LightconeResponseDto] })
  async find() {
    const lightcones = await this.lightconeRepository.findAll({
      populate: ['path'],
      orderBy: { name: QueryOrder.ASC },
    });
    return lightcones.map(lightcone => new LightconeResponseDto(lightcone));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single lightcone by ID' })
  @ApiResponse({ status: 200, description: 'The found lightcone', type: LightconeResponseDto })
  @ApiResponse({ status: 404, description: 'Lightcone not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const lightcone = await this.lightconeRepository.findOne({ lightconeId: id }, { populate: ['path'] });

    if (!lightcone) {
      throw new HttpException(`Lightcone with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return new LightconeResponseDto(lightcone);
  }
}