import { ApiProperty } from '@nestjs/swagger';
import { Move, MoveType } from '../../../entities/User';

export class MoveResponseDto {
  @ApiProperty()
  moveId: number;

  @ApiProperty()
  character: {
    characterId: number;
    name: string;
  };

  @ApiProperty({ enum: MoveType })
  moveType: MoveType;

  @ApiProperty({ nullable: true })
  moveName?: string;

  @ApiProperty()
  isEnhanced: boolean;

  @ApiProperty({ nullable: true })
  resourceCostName?: string;

  @ApiProperty()
  resourceCostAmount: number;

  constructor(move: Move) {
    this.moveId = move.moveId!;
    this.character = {
      characterId: move.character.characterId!,
      name: move.character.name,
    };
    this.moveType = move.moveType;
    this.moveName = move.moveName;
    this.isEnhanced = move.isEnhanced;
    this.resourceCostName = move.resourceCostName;
    this.resourceCostAmount = move.resourceCostAmount;
  }
}
