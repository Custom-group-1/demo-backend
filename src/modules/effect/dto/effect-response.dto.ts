import { ApiProperty } from '@nestjs/swagger';
import { Effect, EffectType, DurationUnit } from '../../../entities/User';

export class EffectResponseDto {
  @ApiProperty()
  effectId: number;

  @ApiProperty({ enum: EffectType })
  effectType: EffectType;

  @ApiProperty()
  effectValue: string;

  @ApiProperty({ nullable: true })
  resourceName?: string;

  @ApiProperty()
  maxStacks: number;

  @ApiProperty({ nullable: true })
  durationValue?: number;

  @ApiProperty({ enum: DurationUnit, nullable: true })
  durationUnit?: DurationUnit;

  @ApiProperty({ nullable: true })
  triggerCondition?: string;

  @ApiProperty({ nullable: true })
  source?: {
    type: string;
    id: number;
    name?: string;
  };

  constructor(effect: Effect) {
    this.effectId = effect.effectId!;
    this.effectType = effect.effectType;
    this.effectValue = effect.effectValue;
    this.resourceName = effect.resourceName;
    this.maxStacks = effect.maxStacks;
    this.durationValue = effect.durationValue;
    this.durationUnit = effect.durationUnit;
    this.triggerCondition = effect.triggerCondition;

    // Determine source based on which relationship is populated
    if (effect.move) {
      this.source = {
        type: 'move',
        id: effect.move.moveId!,
        name: effect.move.moveName,
      };
    } else if (effect.relicMove) {
      this.source = {
        type: 'relic_move',
        id: effect.relicMove.relicMoveId!,
      };
    } else if (effect.lcMove) {
      this.source = {
        type: 'lightcone_move',
        id: effect.lcMove.lcMoveId!,
      };
    } else if (effect.eidolon) {
      this.source = {
        type: 'eidolon',
        id: effect.eidolon.eidolonId!,
      };
    } else if (effect.trace) {
      this.source = {
        type: 'trace',
        id: effect.trace.traceId!,
        name: effect.trace.type,
      };
    }
  }
}