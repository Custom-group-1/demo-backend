import { ApiProperty } from '@nestjs/swagger';
import { Lightcone } from '../../../entities/User';

export class LightconeResponseDto {
  @ApiProperty()
  lightconeId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  path: {
    pathId: number;
    pathName: string;
  };

  constructor(lightcone: Lightcone) {
    this.lightconeId = lightcone.lightconeId!;
    this.name = lightcone.name;
    this.path = {
      pathId: lightcone.path.pathId!,
      pathName: lightcone.path.pathName,
    };
  }
}