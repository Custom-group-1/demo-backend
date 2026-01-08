import { 
  Entity, 
  Property, 
  PrimaryKey, 
  Enum, 
  Check, 
  Opt, 
  DecimalType, 
  ManyToOne, 
  OneToMany, 
  Collection, 
  Cascade
} from '@mikro-orm/core';

// ==========================================================
// 1. ENUMS
// ==========================================================

export enum EntityType {
  CHARACTER = 'character',
  SUMMON = 'summon',       
  ENEMY = 'enemy'
}

export enum MoveType {
  BASIC = 'basic',
  SKILL = 'skill',
  ULT = 'ult',      
  TECHNIQUE = 'technique',
  MEMO_ACTION = 'memo_action'
}

export enum TraceType {
  A2 = 'A2', 
  A4 = 'A4', 
  A6 = 'A6', 
  TALENT = 'talent',
}

export enum EffectType {
  SPEED_FLAT = 'SPD_FLAT',      // Adds to total speed
  SPEED_PERCENT = 'SPD_PERCENT',// Multiplies against computedBaseSpeed
  ACTION_ADVANCE = 'ACTION_ADVANCE', // Forward AV
  ACTION_DELAY = 'ACTION_DELAY', // Delay AV
  MODIFY_RESOURCE = 'MODIFY_RESOURCE' // Grant/Consume Stacks (e.g. "Grant 3 Enhanced charges")
}

export enum DurationUnit {
  TURN = 'turn',
  ACTION = 'action',
  PERMANENT = 'permanent'
}

// ==========================================================
// USER MANAGEMENT
// ==========================================================

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey()
  Id?: number;

  @Property({ unique: true })
  name!: string;

  @Property({ onCreate: () => new Date(), nullable: true })
  createdAt: Date & Opt = new Date();

  @Property({ onUpdate: () => new Date(), nullable: true })
  updatedAt: Date & Opt = new Date();
}

// ==========================================================
// 2. STATIC DEFINITIONS
// ==========================================================

@Entity({ tableName: 'paths' })
export class Path {
  @PrimaryKey()
  pathId?: number;
  @Property({ unique: true })
  pathName!: string;
}

@Entity({ tableName: 'characters' })
export class Character {
  @PrimaryKey()
  characterId?: number;

  @Property({ unique: true })
  name!: string;

  // Internal Base Speed (e.g. 99) used for % calculations
  @Property({ type: DecimalType, precision: 6, scale: 2 })
  baseSpeed!: string; 

  @ManyToOne(() => Path)
  path!: Path;

  @OneToMany(() => Move, move => move.character, { cascade: [Cascade.ALL] })
  moves = new Collection<Move>(this);

  @OneToMany(() => Eidolon, eidolon => eidolon.character, { cascade: [Cascade.ALL] })
  eidolons = new Collection<Eidolon>(this);

  @OneToMany(() => Trace, trace => trace.character, { cascade: [Cascade.ALL] })
  traces = new Collection<Trace>(this);

  @OneToMany(() => SummonConfig, summon => summon.ownerCharacter, { cascade: [Cascade.ALL] })
  summons = new Collection<SummonConfig>(this);
}

@Entity({ tableName: 'traces' })
export class Trace {
  @PrimaryKey()
  traceId?: number;
  @ManyToOne(() => Character)
  character!: Character;
  @Enum(() => TraceType)
  type!: TraceType;
  @Property({ type: 'text', nullable: true })
  description?: string;
  @OneToMany(() => Effect, effect => effect.trace)
  effects = new Collection<Effect>(this);
}

@Entity({ tableName: 'eidolons' })
export class Eidolon {
  @PrimaryKey()
  eidolonId?: number;
  @ManyToOne(() => Character)
  character!: Character;
  @Property()
  @Check({ expression: 'rank BETWEEN 1 AND 6' })
  rank!: number; 
  @OneToMany(() => Effect, effect => effect.eidolon)
  effects = new Collection<Effect>(this);
}

@Entity({ tableName: 'summon_configs' })
export class SummonConfig {
  @PrimaryKey()
  summonConfigId?: number;
  @ManyToOne(() => Character)
  ownerCharacter!: Character;
  @Property()
  name!: string; 
  @Property({ type: DecimalType, precision: 6, scale: 2 })
  baseSpeed!: string; 
  @Property({ default: false })
  isFixedSpeed: boolean = false; 
}

@Entity({ tableName: 'relic_sets' })
export class RelicSet {
  @PrimaryKey()
  relicId?: number;
  @Property({ unique: true })
  name!: string;
  @OneToMany(() => RelicMove, rm => rm.relicSet)
  effects = new Collection<RelicMove>(this);
}

@Entity({ tableName: 'lightcones' })
export class Lightcone {
  @PrimaryKey()
  lightconeId?: number;
  @Property({ unique: true })
  name!: string;
  @ManyToOne(() => Path)
  path!: Path;
  @OneToMany(() => LightconeMove, lm => lm.lightcone)
  effects = new Collection<LightconeMove>(this);
}

// ==========================================================
// 3. MOVES (Actions)
// ==========================================================

@Entity({ tableName: 'moves' })
export class Move {
  @PrimaryKey()
  moveId?: number;

  @ManyToOne(() => Character)
  character!: Character;

  @Enum(() => MoveType)
  moveType!: MoveType;

  @Property({ nullable: true })
  moveName?: string;

  // [UPDATED] Replaced Level Enum with Boolean
  // Does this count as an "Enhanced" move? (Triggers Herta E2, etc.)
  @Property({ default: false })
  isEnhanced: boolean = false;

  // Does this move require a resource to be used? (e.g. "blade_enhanced_state")
  @Property({ nullable: true })
  resourceCostName?: string; 

  @Property({ default: 0 })
  resourceCostAmount: number = 0;

  @OneToMany(() => Effect, effect => effect.move)
  effects = new Collection<Effect>(this);
}

@Entity({ tableName: 'relic_moves' })
export class RelicMove {
  @PrimaryKey()
  relicMoveId?: number;
  @ManyToOne(() => RelicSet)
  relicSet!: RelicSet;
  @Property()
  pieceRequirement!: number;
  @OneToMany(() => Effect, effect => effect.relicMove)
  effects = new Collection<Effect>(this);
}

@Entity({ tableName: 'lightcone_moves' })
export class LightconeMove {
  @PrimaryKey()
  lcMoveId?: number;
  @ManyToOne(() => Lightcone)
  lightcone!: Lightcone;
  @OneToMany(() => Effect, effect => effect.lcMove)
  effects = new Collection<Effect>(this);
}

// ==========================================================
// 4. EFFECTS (Rules)
// ==========================================================

@Entity({ tableName: 'effects' })
@Check({ expression: '(move_id IS NOT NULL)::int + (relic_move_id IS NOT NULL)::int + (lc_move_id IS NOT NULL)::int + (eidolon_id IS NOT NULL)::int + (trace_id IS NOT NULL)::int = 1' })
export class Effect {
  @PrimaryKey()
  effectId?: number;

  @Enum(() => EffectType)
  effectType!: EffectType;

  @Property({ type: DecimalType, precision: 6, scale: 2 })
  effectValue!: string;

  @Property({ nullable: true })
  resourceName?: string;

  @Property({ default: 1 })
  maxStacks: number = 1;

  @Property({ nullable: true })
  durationValue?: number;

  @Enum(() => DurationUnit)
  durationUnit?: DurationUnit;

  @Property({ nullable: true })
  triggerCondition?: string;

  // --- ENSURE ALL THESE HAVE THE "name" PROPERTY ---

  @ManyToOne(() => Move, { nullable: true, name: 'move_id' })
  move?: Move;

  @ManyToOne(() => RelicMove, { nullable: true, name: 'relic_move_id' })
  relicMove?: RelicMove;

  @ManyToOne(() => LightconeMove, { nullable: true, name: 'lc_move_id' })
  lcMove?: LightconeMove;

  @ManyToOne(() => Eidolon, { nullable: true, name: 'eidolon_id' })
  eidolon?: Eidolon;

  @ManyToOne(() => Trace, { nullable: true, name: 'trace_id' })
  trace?: Trace;
}

// ==========================================================
// 5. SIMULATION STATE
// ==========================================================

@Entity({ tableName: 'sessions' })
export class Session {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  sessionId!: string;

  @Property({ nullable: true })
  sessionName?: string;

  @OneToMany(() => SessionEntity, se => se.session)
  entities = new Collection<SessionEntity>(this);
}

@Entity({ tableName: 'session_entities' })
export class SessionEntity {
  @PrimaryKey()
  entityId?: number;

  @ManyToOne(() => Session)
  session!: Session;

  @Enum(() => EntityType)
  type!: EntityType; 

  @ManyToOne(() => Character, { nullable: true })
  sourceCharacter?: Character;
  @ManyToOne(() => SummonConfig, { nullable: true })
  sourceSummon?: SummonConfig;
  @ManyToOne(() => SessionEntity, { nullable: true })
  masterEntity?: SessionEntity;

  // 1. Screen Speed (The "Floor" input by user)
  @Property({ type: DecimalType, precision: 6, scale: 2 })
  initialDisplaySpeed!: string; 

  // 2. Base Speed (Hidden, for % math)
  @Property({ type: DecimalType, precision: 6, scale: 2 })
  computedBaseSpeed!: string;

  @Property({ type: DecimalType, precision: 10, scale: 4, default: 0 })
  currentActionValue: string = '0';

  @OneToMany(() => SessionActiveEffect, ae => ae.targetEntity)
  activeEffects = new Collection<SessionActiveEffect>(this);

  // Tracks things like "blade_enhanced_state" stacks
  @OneToMany(() => SessionResource, sr => sr.entity)
  resources = new Collection<SessionResource>(this);
}

@Entity({ tableName: 'session_resources' })
export class SessionResource {
  @PrimaryKey()
  resourceId?: number;
  @ManyToOne(() => SessionEntity)
  entity!: SessionEntity;
  @Property()
  resourceName!: string; 
  @Property({ type: 'integer', default: 0 })
  value: number = 0;
}

@Entity({ tableName: 'session_active_effects' })
export class SessionActiveEffect {
  @PrimaryKey()
  activeEffectId?: number;
  @ManyToOne(() => SessionEntity)
  targetEntity!: SessionEntity;
  @ManyToOne(() => Effect)
  sourceEffect!: Effect;
  @Property({ default: 1 })
  currentStacks: number = 1;
  @Property({ nullable: true })
  turnsRemaining?: number;
  @Property({ type: DecimalType, precision: 10, scale: 4 })
  snapshotValue!: string; 
}