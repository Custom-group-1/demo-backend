import { ApiProperty } from '@nestjs/swagger';
import { RelicSet } from '../../../entities/User';

export class RelicSetResponseDto {
  @ApiProperty()
  relicId: number;

  @ApiProperty()
  name: string;

  constructor(relicSet: RelicSet) {
    this.relicId = relicSet.relicId!;
    this.name = relicSet.name;
  }
}