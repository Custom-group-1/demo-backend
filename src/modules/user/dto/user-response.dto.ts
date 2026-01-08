import { Expose } from 'class-transformer';
import { User } from '../../../entities/User';

export class UserResponseDto {
  @Expose()
  id: number; // Frontend thích dùng chữ thường 'id'

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;

  constructor(user: User) {
    // Map từ Entity (Viết hoa) sang DTO (Viết thường)
    this.id = user.Id!; 
    this.name = user.name;
    this.createdAt = user.createdAt as Date;
  }
}