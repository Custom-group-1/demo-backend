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
import { Path } from '../../entities/User';
import { PathResponseDto } from './dto/path-response.dto';

@ApiTags('Path Management')
@Controller('path')
export class PathController {
  constructor(
    @InjectRepository(Path)
    private readonly pathRepository: EntityRepository<Path>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all paths' })
  @ApiResponse({
    status: 200,
    description: 'Found paths',
    type: [PathResponseDto],
  })
  async find() {
    const paths = await this.pathRepository.findAll({
      orderBy: { pathName: QueryOrder.ASC },
    });
    return paths.map((path) => new PathResponseDto(path));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single path by ID' })
  @ApiResponse({
    status: 200,
    description: 'The found path',
    type: PathResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Path not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const path = await this.pathRepository.findOne({ pathId: id });

    if (!path) {
      throw new HttpException(
        `Path with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return new PathResponseDto(path);
  }
}
