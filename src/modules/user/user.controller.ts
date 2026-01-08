import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EntityRepository, QueryOrder, wrap, EntityManager } from '@mikro-orm/postgresql'; // Hoặc @mikro-orm/core tùy driver
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../../entities/User'; // Import đúng đường dẫn file User khổng lồ của bạn
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('User Management') // Thêm tag cho đẹp Swagger
@Controller('user')
export class UserController {
  constructor(
    @InjectRepository(User) private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
  ) { }

  @Get()
  @ApiOperation({ summary: 'List up to 20 users' })
  @ApiResponse({ status: 200, description: 'Found users', type: [UserResponseDto] })
  async find() {
    const users = await this.userRepository.findAll({
      // populate: ['name'], <-- XÓA DÒNG NÀY (Name tự động được lấy)
      orderBy: { name: QueryOrder.DESC },
      limit: 20,
    });
    return users.map(user => new UserResponseDto(user));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single user by ID' })
  @ApiResponse({ status: 200, description: 'The found user', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    // SỬA QUAN TRỌNG: Truyền object điều kiện { Id: id }
    const user = await this.userRepository.findOne({ Id: id });

    if (!user) {
      throw new HttpException(`User with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return new UserResponseDto(user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponseDto })
  async create(@Body() createUserDto: CreateUserDto) {
    // MikroORM sẽ tự map createUserDto.name vào entity
    const user = this.userRepository.create(createUserDto);
    await this.em.flush();

    return new UserResponseDto(user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    // SỬA: Tìm theo Id viết hoa
    const user = await this.userRepository.findOne({ Id: id });
    
    if (!user) {
      throw new HttpException(`User with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    
    // Hàm wrap giúp update dữ liệu an toàn
    wrap(user).assign(updateUserDto);
    await this.em.flush();

    return new UserResponseDto(user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing user' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    // SỬA: Tìm theo Id viết hoa
    const user = await this.userRepository.findOne({ Id: id });
    
    if (!user) {
      throw new HttpException(`User with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    
    await this.em.removeAndFlush(user);
  }
}