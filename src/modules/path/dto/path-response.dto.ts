import { ApiProperty } from '@nestjs/swagger';
import { Path } from '../../../entities/User';

export class PathResponseDto {
  @ApiProperty()
  pathId: number;

  @ApiProperty()
  pathName: string;

  constructor(path: Path) {
    this.pathId = path.pathId!;
    this.pathName = path.pathName;
  }
}