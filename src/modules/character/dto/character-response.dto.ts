import { ApiProperty } from '@nestjs/swagger';
import { Character } from '../../../entities/User';

export class CharacterResponseDto {
  @ApiProperty()
  characterId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  baseSpeed: string;

  @ApiProperty()
  path: {
    pathId: number;
    pathName: string;
  };

  constructor(character: Character) {
    this.characterId = character.characterId!;
    this.name = character.name;
    this.baseSpeed = character.baseSpeed;
    this.path = {
      pathId: character.path.pathId!,
      pathName: character.path.pathName,
    };
  }
}
