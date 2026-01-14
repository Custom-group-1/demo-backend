import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from '../../entities/User';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // 1. Validate User credentials
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({ email });

    if (user && user.password && user.password === pass) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  // 2. Login - Generates JWT
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.name, sub: user.Id };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.Id,
        name: user.name,
      },
    };
  }

  // 3. Register - Creates user via standard repo calls
  async register(createUserDto: CreateUserDto) {
    // FIX: Check if email already exists (since that's what we log in with)
    const existing = await this.userRepository.findOne({
      email: createUserDto.email,
    });
    if (existing) {
      throw new UnauthorizedException('Email already exists');
    }

    const user = this.userRepository.create(createUserDto);
    await this.userRepository.getEntityManager().flush();

    // FIX: Pass 'email' instead of 'name' to match the new LoginDto
    return this.login({ email: user.email, password: user.password });
  }
}
