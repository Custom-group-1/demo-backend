import { 
  Entity, 
  Property, 
  PrimaryKey, 
  Enum, 
  Check, 
  Opt,
  DecimalType
} from '@mikro-orm/core';

// ==========================================================
// ENUMS 
// ==========================================================

export enum MoveType {
  BASIC = 'basic',
  SKILL = 'skill',
  ULT = 'ult',
  TALENT = 'talent',
  TRACE_A1 = 'trace_a1',
  TRACE_A2 = 'trace_a2',
  TRACE_A3 = 'trace_a3',
  EIDOLON_1 = 'eidolon_1',
  EIDOLON_2 = 'eidolon_2',
  EIDOLON_3 = 'eidolon_3',
  EIDOLON_4 = 'eidolon_4',
  EIDOLON_5 = 'eidolon_5',
  EIDOLON_6 = 'eidolon_6',
}

export enum EffectType {
  AA = 'AA',
  SPD = 'SPD',
}

export enum EffectTarget {
  SELF = 'self',
  ALLY = 'ally',
  TEAM = 'team',
  ENEMY = 'enemy',
}

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  name!: string;

  @Property()
  age?: number;

  @Property({ onCreate: () => new Date(), nullable: true })
  createdAt: Date & Opt = new Date();

  @Property({ onUpdate: () => new Date(), nullable: true })
  updatedAt: Date & Opt = new Date();
}

// ==========================================================
// BASE DATA ENTITIES
// ==========================================================

// [cite: 3]
@Entity({ tableName: 'paths' })
export class Path {
  @PrimaryKey()
  pathId!: number;

  @Property({ unique: true })
  pathName!: string;
}

// [cite: 4]
@Entity({ tableName: 'characters' })
export class Character {
  @PrimaryKey()
  characterId!: number;

  @Property({ unique: true })
  name!: string;

  @Property({ type: 'text', nullable: true })
  note?: string;
}

// [cite: 5]
@Entity({ tableName: 'relic_sets' })
export class RelicSet {
  @PrimaryKey()
  relicId!: number;

  @Property({ unique: true })
  name!: string;

  @Property({ type: 'text', nullable: true })
  note?: string;
}

// [cite: 6]
@Entity({ tableName: 'lightcones' })
@Check({ expression: 'imposition BETWEEN 1 AND 5' })
export class Lightcone {
  @PrimaryKey()
  lightconeId!: number;

  @Property({ unique: true })
  name!: string;

  @Property({ default: 1 })
  imposition: number = 1;

  @Property({ type: 'text', nullable: true })
  note?: string;
}

// ==========================================================
// MOVES
// ==========================================================

// [cite: 7]
@Entity({ tableName: 'moves' })
export class Move {
  @PrimaryKey()
  moveId!: number;

  @Enum(() => MoveType)
  moveType!: MoveType;

  @Property({ nullable: true })
  moveName?: string;

  @Property({ type: 'text', nullable: true })
  moveNote?: string;
}

// [cite: 8]
@Entity({ tableName: 'relic_moves' })
export class RelicMove {
  @PrimaryKey()
  relicMoveId!: number;

  @Enum(() => MoveType)
  triggerMoveType!: MoveType;

  @Property({ default: 'any' })
  triggerTargetCondition: string = 'any';

  @Property({ nullable: true })
  moveName?: string;
}

// [cite: 9]
@Entity({ tableName: 'lightcone_moves' })
export class LightconeMove {
  @PrimaryKey()
  lcMoveId!: number;

  @Enum(() => MoveType)
  triggerMoveType!: MoveType;

  @Property({ default: 'any' })
  triggerTargetCondition: string = 'any';

  @Property({ nullable: true })
  moveName?: string;
}

// ==========================================================
// EFFECTS
// ==========================================================

// [cite: 10, 11]
@Entity({ tableName: 'effects' })
@Check({ expression: '(move_id IS NOT NULL)::int + (relic_move_id IS NOT NULL)::int + (lc_move_id IS NOT NULL)::int = 1' })
export class Effect {
  @PrimaryKey()
  effectId!: number;

  @Enum(() => EffectType)
  effectType!: EffectType;

  @Property({ type: DecimalType, precision: 6, scale: 2, nullable: true })
  effectValue?: string;

  @Property({ default: true })
  valueIsPercent: boolean = true;

  @Enum({ items: () => EffectTarget, default: EffectTarget.SELF })
  effectTarget: EffectTarget = EffectTarget.SELF;

  @Property({ nullable: true })
  duration?: string;

  @Property({ nullable: true })
  triggerCondition?: string;

  @Property()
  @Check({ expression: "source_origin IN ('character', 'relic', 'lightcone')" })
  sourceOrigin!: string;

  @Property({ type: 'text', nullable: true })
  note?: string;
  @Property({ nullable: true, fieldName: 'move_id' })
  moveId?: number;

  @Property({ nullable: true, fieldName: 'relic_move_id' })
  relicMoveId?: number;

  @Property({ nullable: true, fieldName: 'lc_move_id' })
  lcMoveId?: number;
}

// [cite: 12]
@Entity({ tableName: 'lightcone_impositions' })
export class LightconeImposition {
  @PrimaryKey()
  lciId!: number;

  @Property()
  @Check({ expression: 'imposition BETWEEN 1 AND 5' })
  imposition!: number;

  @Enum(() => EffectType)
  effectType!: EffectType;

  @Property({ type: DecimalType, precision: 6, scale: 2 })
  effectValue!: string;

  @Property({ default: true })
  valueIsPercent: boolean = true;
}

// ==========================================================
// EQUIPS
// ==========================================================

// [cite: 13]
@Entity({ tableName: 'allowed_relics' })
export class AllowedRelic {
  @PrimaryKey()
  allowedId!: number;
}

// [cite: 14]
@Entity({ tableName: 'equips' })
@Check({ expression: 'relic_id IS NOT NULL OR lightcone_id IS NOT NULL' })
export class Equip {
  @PrimaryKey()
  equipId!: number;
  @Property({ nullable: true, fieldName: 'relic_id' })
  relicId?: number;

  @Property({ nullable: true, fieldName: 'lightcone_id' })
  lightconeId?: number;
}

// ==========================================================
// SIMULATION / SESSION
// ==========================================================

// [cite: 21]
@Entity({ tableName: 'character_actions' })
export class CharacterAction {
  @PrimaryKey()
  actionId!: number;

  @Enum(() => MoveType)
  moveType!: MoveType;

  @Property({ default: 'any' })
  targetCondition: string = 'any';

  @Property({ onCreate: () => new Date() })
  actionTimestamp: Date & Opt = new Date();
}

// [cite: 22]
@Entity({ tableName: 'sessions' })
export class Session {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  sessionId!: string;

  @Property({ nullable: true })
  sessionName?: string;

  @Property({ nullable: true })
  createdBy?: string;

  @Property({ onCreate: () => new Date(), nullable: true })
  createdAt: Date & Opt = new Date();
}

// [cite: 23]
@Entity({ tableName: 'session_entities' })
export class SessionEntity {
  @PrimaryKey()
  entityId!: number;

  @Property({ default: false })
  isEnemy: boolean = false;

  @Property({ type: DecimalType, precision: 6, scale: 2, nullable: true })
  baseSpd?: string;

  @Property({ type: DecimalType, precision: 6, scale: 2, nullable: true })
  currentSpd?: string;

  @Property({ type: DecimalType, precision: 6, scale: 2, default: 0 })
  currentEnergy: string = '0';

  @Property({ type: DecimalType, precision: 6, scale: 2, default: 100 })
  maxEnergy: string = '100';

  @Property({ type: DecimalType, precision: 10, scale: 4, default: 0 })
  currentActionValue: string = '0';

  @Property({ type: 'text', nullable: true })
  note?: string;
}

// [cite: 24]
@Entity({ tableName: 'session_timeline' })
export class SessionTimeline {
  @PrimaryKey()
  eventId!: number;

  @Property({ nullable: true })
  tickNumber?: number;

  @Property({ type: DecimalType, precision: 10, scale: 4, nullable: true })
  deltaAv?: string;

  @Property({ type: DecimalType, precision: 6, scale: 2, nullable: true })
  deltaEnergy?: string;

  @Property({ nullable: true })
  triggerSource?: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ onCreate: () => new Date(), nullable: true })
  createdAt: Date & Opt = new Date();
}
