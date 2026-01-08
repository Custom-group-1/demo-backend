import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm.config';
import { 
  Path, Character, RelicSet, RelicMove, Effect,
  EffectType, DurationUnit, Lightcone, LightconeMove, Move, MoveType,
  Trace, TraceType, Eidolon, SummonConfig // [ADDED] SummonConfig
} from './entities/User';

async function bootstrap() {
  const orm = await MikroORM.init(config);
  const em = orm.em.fork();

  console.log('🌱 Starting 1.X Full Data Seeder (Complete Merged)...');

  // ==========================================================
  // 1. PATHS
  // ==========================================================
  const pathsData = [
    'Destruction', 'The Hunt', 'Erudition', 
    'Harmony', 'Nihility', 'Preservation', 'Abundance'
  ];

  const pathMap = new Map<string, Path>();

  for (const pName of pathsData) {
    const path = em.create(Path, { pathName: pName });
    pathMap.set(pName, path);
  }
  console.log('... Paths staged.');

  // ==========================================================
  // 2. LIGHTCONES (1.X Era)
  // ==========================================================
  console.log('... Seeding Lightcones');

  // 1. Dance! Dance! Dance! (4* Harmony)
  const ddd = em.create(Lightcone, { 
    name: 'Dance! Dance! Dance!', 
    path: pathMap.get('Harmony')! 
  });
  const dddMove = em.create(LightconeMove, { lightcone: ddd });
  em.create(Effect, {
    lcMove: dddMove,
    effectType: EffectType.ACTION_ADVANCE,
    effectValue: '24.00',
    triggerCondition: "move_type == 'ult'",
    durationUnit: DurationUnit.ACTION,
    maxStacks: 1, 
  });

  // 2. Multiplication (3* Abundance)
  const multiplication = em.create(Lightcone, { 
    name: 'Multiplication', 
    path: pathMap.get('Abundance')! 
  });
  const multMove = em.create(LightconeMove, { lightcone: multiplication });
  em.create(Effect, {
    lcMove: multMove,
    effectType: EffectType.ACTION_ADVANCE,
    effectValue: '20.00',
    triggerCondition: "move_type == 'basic'",
    durationUnit: DurationUnit.ACTION,
    maxStacks: 1, 
  });

  // 3. Patience Is All You Need (5* Nihility)
  const payn = em.create(Lightcone, { 
    name: 'Patience Is All You Need', 
    path: pathMap.get('Nihility')! 
  });
  const paynMove = em.create(LightconeMove, { lightcone: payn });
  em.create(Effect, {
    lcMove: paynMove,
    effectType: EffectType.SPEED_PERCENT,
    effectValue: '0.048',
    maxStacks: 3, 
    triggerCondition: "on_attack",
    durationUnit: DurationUnit.PERMANENT,
  });

  // 4. Echoes of the Coffin (5* Abundance)
  const echoes = em.create(Lightcone, { 
    name: 'Echoes of the Coffin', 
    path: pathMap.get('Abundance')! 
  });
  const echoesMove = em.create(LightconeMove, { lightcone: echoes });
  em.create(Effect, {
    lcMove: echoesMove,
    effectType: EffectType.SPEED_FLAT,
    effectValue: '12.00', 
    durationUnit: DurationUnit.TURN,
    durationValue: 1,
    triggerCondition: "move_type == 'ult'",
    maxStacks: 1, 
  });

  // 5. Adversarial (3* Hunt)
  const adversarial = em.create(Lightcone, { 
    name: 'Adversarial', 
    path: pathMap.get('The Hunt')! 
  });
  const advMove = em.create(LightconeMove, { lightcone: adversarial });
  em.create(Effect, {
    lcMove: advMove,
    effectType: EffectType.SPEED_PERCENT,
    effectValue: '0.18',
    durationUnit: DurationUnit.TURN,
    durationValue: 2,
    triggerCondition: "on_kill",
    maxStacks: 1, 
  });

  // --- STATIC: Other Common 1.X Lightcones ---
  const staticLCs = [
    { name: 'On the Fall of an Aeon', path: 'Destruction' },
    { name: 'Something Irreplaceable', path: 'Destruction' },
    { name: 'The Unreachable Side', path: 'Destruction' },
    { name: 'I Shall Be My Own Sword', path: 'Destruction' },
    { name: 'The Moles Welcome You', path: 'Destruction' },
    { name: 'A Secret Vow', path: 'Destruction' },
    { name: 'Under the Blue Sky', path: 'Destruction' },
    { name: 'Cruising in the Stellar Sea', path: 'The Hunt' },
    { name: 'In the Night', path: 'The Hunt' },
    { name: 'Sleep Like the Dead', path: 'The Hunt' },
    { name: 'Swordplay', path: 'The Hunt' },
    { name: 'Only Silence Remains', path: 'The Hunt' },
    { name: 'Night on the Milky Way', path: 'Erudition' },
    { name: 'Before Dawn', path: 'Erudition' },
    { name: 'An Instant Before A Gaze', path: 'Erudition' },
    { name: 'The Seriousness of Breakfast', path: 'Erudition' },
    { name: 'Geniuses Repose', path: 'Erudition' },
    { name: 'Today is Another Peaceful Day', path: 'Erudition' },
    { name: 'But the Battle Isnt Over', path: 'Harmony' },
    { name: 'Past Self in Mirror', path: 'Harmony' },
    { name: 'Planetary Rendezvous', path: 'Harmony' },
    { name: 'Memories of the Past', path: 'Harmony' },
    { name: 'Carve the Moon, Weave the Clouds', path: 'Harmony' },
    { name: 'Meshing Cogs', path: 'Harmony' },
    { name: 'In the Name of the World', path: 'Nihility' },
    { name: 'Incessant Rain', path: 'Nihility' },
    { name: 'Good Night and Sleep Well', path: 'Nihility' },
    { name: 'Eyes of the Prey', path: 'Nihility' },
    { name: 'Resolution Shines As Pearls of Sweat', path: 'Nihility' },
    { name: 'Moment of Victory', path: 'Preservation' },
    { name: 'Texture of Memories', path: 'Preservation' },
    { name: 'She Already Shut Her Eyes', path: 'Preservation' },
    { name: 'Landaus Choice', path: 'Preservation' },
    { name: 'Day One of My New Life', path: 'Preservation' },
    { name: 'Time Waits for No One', path: 'Abundance' },
    { name: 'Post-Op Conversation', path: 'Abundance' },
    { name: 'Quid Pro Quo', path: 'Abundance' },
    { name: 'Shared Feeling', path: 'Abundance' },
  ];

  for (const lc of staticLCs) {
    em.create(Lightcone, {
      name: lc.name,
      path: pathMap.get(lc.path)!,
    });
  }
  
  // ==========================================================
  // 3. RELIC SETS
  // ==========================================================
  
  const hackerspace = em.create(RelicSet, { name: 'Messenger Traversing Hackerspace' });
  const hacker4pc = em.create(RelicMove, { relicSet: hackerspace, pieceRequirement: 4 });
  em.create(Effect, {
    relicMove: hacker4pc,
    effectType: EffectType.SPEED_PERCENT,
    effectValue: '0.12',
    durationUnit: DurationUnit.TURN,
    durationValue: 1,
    triggerCondition: "move_type == 'ult'", 
    maxStacks: 1
  });

  const eagle = em.create(RelicSet, { name: 'Eagle of Twilight Line' });
  const eagle4pc = em.create(RelicMove, { relicSet: eagle, pieceRequirement: 4 });
  em.create(Effect, {
    relicMove: eagle4pc,
    effectType: EffectType.ACTION_ADVANCE,
    effectValue: '25.00',
    triggerCondition: "move_type == 'ult'",
    durationUnit: DurationUnit.ACTION,
    maxStacks: 1
  });

  const vonwacq = em.create(RelicSet, { name: 'Sprightly Vonwacq' });
  const vonwacq2pc = em.create(RelicMove, { relicSet: vonwacq, pieceRequirement: 2 });
  em.create(Effect, {
    relicMove: vonwacq2pc,
    effectType: EffectType.ACTION_ADVANCE,
    effectValue: '40.00',
    triggerCondition: "battle_start == true AND speed >= 120", 
    durationUnit: DurationUnit.ACTION,
    maxStacks: 1
  });

  const otherSets = [
    'Passerby of Wandering Cloud', 'Knight of Purity Palace', 'Hunter of Glacial Forest',
    'Champion of Streetwise Boxing', 'Guard of Wuthering Snow', 'Firesmith of Lava-Forging',
    'Genius of Brilliant Stars', 'Band of Sizzling Thunder', 'Wastelander of Banditry Desert',
    'Longevous Disciple', 'Prisoner in Deep Confinement', 'The Ashblazing Grand Duke',
    'Space Sealing Station', 'Fleet of the Ageless', 'Pan-Cosmic Commercial Enterprise',
    'Belobog of the Architects', 'Celestial Differentiator', 'Inert Salsotto',
    'Talia: Kingdom of Banditry', 'Rutilant Arena', 'Broken Keel', 'Firmament Frontline: Glamoth',
    'Penacony, Land of the Dreams', 'Musketeer of Wild Wheat'
  ];

  for (const setName of otherSets) {
    em.create(RelicSet, { name: setName });
  }
  console.log('... Relic Sets staged.');

  // ==========================================================
  // 4. CHARACTERS (1.X Era)
  // ==========================================================

  const charsData = [
    // --- Standard 5* ---
    { name: 'Himeko', spd: '96.00', path: 'Erudition' },
    { name: 'Welt', spd: '102.00', path: 'Nihility' },
    { name: 'Bronya', spd: '99.00', path: 'Harmony' },
    { name: 'Gepard', spd: '92.00', path: 'Preservation' },
    { name: 'Clara', spd: '90.00', path: 'Destruction' },
    { name: 'Yanqing', spd: '109.00', path: 'The Hunt' },
    { name: 'Bailu', spd: '98.00', path: 'Abundance' },

    // --- Limited 1.X ---
    { name: 'Seele', spd: '115.00', path: 'The Hunt' },
    { name: 'Jing Yuan', spd: '99.00', path: 'Erudition' },
    { name: 'Silver Wolf', spd: '107.00', path: 'Nihility' },
    { name: 'Luocha', spd: '101.00', path: 'Abundance' },
    { name: 'Blade', spd: '97.00', path: 'Destruction' },
    { name: 'Kafka', spd: '100.00', path: 'Nihility' },
    { name: 'Dan Heng • Imbibitor Lunae', spd: '102.00', path: 'Destruction' },
    { name: 'Fu Xuan', spd: '100.00', path: 'Preservation' },
    { name: 'Jingliu', spd: '96.00', path: 'Destruction' },
    { name: 'Topaz & Numby', spd: '110.00', path: 'The Hunt' },
    { name: 'Huohuo', spd: '98.00', path: 'Abundance' },
    { name: 'Argenti', spd: '103.00', path: 'Erudition' },
    { name: 'Ruan Mei', spd: '104.00', path: 'Harmony' },
    { name: 'Dr. Ratio', spd: '103.00', path: 'The Hunt' },

    // --- Key 4* ---
    { name: 'Tingyun', spd: '112.00', path: 'Harmony' },
    { name: 'Asta', spd: '106.00', path: 'Harmony' },
    { name: 'Pela', spd: '105.00', path: 'Nihility' },
    { name: 'Yukong', spd: '107.00', path: 'Harmony' },
    { name: 'Hanya', spd: '110.00', path: 'Harmony' },
    { name: 'Sushang', spd: '107.00', path: 'The Hunt' },
    { name: 'Dan Heng', spd: '110.00', path: 'The Hunt' },
    { name: 'March 7th', spd: '101.00', path: 'Preservation' },
    { name: 'Natasha', spd: '98.00', path: 'Abundance' },
    { name: 'Lynx', spd: '100.00', path: 'Abundance' },
    { name: 'Qingque', spd: '98.00', path: 'Erudition' },
    { name: 'Sampo', spd: '102.00', path: 'Nihility' },
    { name: 'Serval', spd: '104.00', path: 'Erudition' },
    { name: 'Herta', spd: '100.00', path: 'Erudition' },
    { name: 'Hook', spd: '94.00', path: 'Destruction' },
    { name: 'Arlan', spd: '102.00', path: 'Destruction' },
    { name: 'Luka', spd: '103.00', path: 'Nihility' },
    { name: 'Guinaifen', spd: '106.00', path: 'Nihility' },
    { name: 'Xueyi', spd: '103.00', path: 'Destruction' },
  ];

  const charMap = new Map<string, Character>();

  for (const c of charsData) {
    const char = em.create(Character, {
      name: c.name,
      baseSpeed: c.spd,
      path: pathMap.get(c.path)!,
    });
    charMap.set(c.name, char);
  }
  console.log(`... ${charsData.length} Characters staged.`);

  console.log('... Configuring Character Moves');

  // --- SEELE ---
  const seele = charMap.get('Seele')!;
  const seeleSkill = em.create(Move, {
    character: seele, moveType: MoveType.SKILL, moveName: 'Sheathed Blade', isEnhanced: false, resourceCostAmount: 0 
  });
  em.create(Effect, {
    move: seeleSkill, effectType: EffectType.SPEED_PERCENT, effectValue: '0.25', durationUnit: DurationUnit.TURN, durationValue: 2, maxStacks: 1
  });

  // --- BRONYA ---
  const bronya = charMap.get('Bronya')!;
  const bronyaSkill = em.create(Move, {
    character: bronya, moveType: MoveType.SKILL, moveName: 'Combat Redeployment', isEnhanced: false, resourceCostAmount: 0 
  });
  em.create(Effect, {
    move: bronyaSkill, effectType: EffectType.ACTION_ADVANCE, effectValue: '100.00', durationUnit: DurationUnit.ACTION, maxStacks: 1
  });

  // --- ASTA ---
  const asta = charMap.get('Asta')!;
  const astaUlt = em.create(Move, {
    character: asta, moveType: MoveType.ULT, moveName: 'Astral Blewits', isEnhanced: false, resourceCostAmount: 0 
  });
  em.create(Effect, {
    move: astaUlt, effectType: EffectType.SPEED_FLAT, effectValue: '50.00', durationUnit: DurationUnit.TURN, durationValue: 2, maxStacks: 1
  });

  // --- WELT ---
  const welt = charMap.get('Welt')!;
  const weltSkill = em.create(Move, {
    character: welt, moveType: MoveType.SKILL, moveName: 'Edge of the Void', isEnhanced: false, resourceCostAmount: 0 
  });
  em.create(Effect, {
    move: weltSkill, effectType: EffectType.SPEED_PERCENT, effectValue: '-0.10', durationUnit: DurationUnit.TURN, durationValue: 2, maxStacks: 1
  });

  // --- SUSHANG (Ult) ---
  const sushang = charMap.get('Sushang')!;
  const sushangUlt = em.create(Move, { 
    character: sushang, moveType: MoveType.ULT, moveName: 'Shape of Taixu', isEnhanced: false, resourceCostAmount: 0
  });
  em.create(Effect, { 
    move: sushangUlt, effectType: EffectType.ACTION_ADVANCE, effectValue: '100.00', durationUnit: DurationUnit.ACTION, maxStacks: 1 
  });

  // --- DAN HENG (Skill Slow) ---
  const danheng = charMap.get('Dan Heng')!;
  const dhSkill = em.create(Move, { 
    character: danheng, moveType: MoveType.SKILL, moveName: 'Cloudlancer Art: Torrent', isEnhanced: false, resourceCostAmount: 0
  });
  em.create(Effect, { 
    move: dhSkill, effectType: EffectType.SPEED_PERCENT, effectValue: '-0.12', durationUnit: DurationUnit.TURN, durationValue: 2, maxStacks: 1 
  });

  // ==========================================================
  // 5. TRACES, EIDOLONS & SUMMONS (Full Logic)
  // ==========================================================
  console.log('... Configuring Traces & Eidolons');

  // --- RUAN MEI (Trace) ---
  const ruanMei = charMap.get('Ruan Mei')!;
  const rmTrace = em.create(Trace, {
    character: ruanMei, type: TraceType.TALENT, description: 'Somatotypical GHelix',
  });
  em.create(Effect, {
    trace: rmTrace, effectType: EffectType.SPEED_PERCENT, effectValue: '0.10', triggerCondition: "on_battle_start", durationUnit: DurationUnit.PERMANENT, maxStacks: 1
  });

  // --- HUOHUO (E1) ---
  const huohuo = charMap.get('Huohuo')!;
  const huohuoE1 = em.create(Eidolon, { character: huohuo, rank: 1 });
  em.create(Effect, {
    eidolon: huohuoE1, effectType: EffectType.SPEED_PERCENT, effectValue: '0.12', triggerCondition: "talent_active == true", durationUnit: DurationUnit.TURN, maxStacks: 1
  });

  // --- SEELE A6 ---
  const seeleA6 = em.create(Trace, {
    character: seele, type: TraceType.A6, description: 'Rippling Waves',
  });
  em.create(Effect, {
    trace: seeleA6, effectType: EffectType.ACTION_ADVANCE, effectValue: '20.00', triggerCondition: "move_type == 'basic'", durationUnit: DurationUnit.ACTION, maxStacks: 1
  });

  // --- BRONYA E2 ---
  const bronyaE2 = em.create(Eidolon, { character: bronya, rank: 2 });
  em.create(Effect, {
    eidolon: bronyaE2, effectType: EffectType.SPEED_PERCENT, effectValue: '0.30', triggerCondition: "move_type == 'skill'", durationUnit: DurationUnit.TURN, durationValue: 1, maxStacks: 1
  });

  // --- HANYA (Talent) ---
  const hanya = charMap.get('Hanya')!;
  const hanyaTalent = em.create(Trace, { character: hanya, type: TraceType.TALENT, description: 'Sanction' });

  // --- JINGLIU (Talent: Transmigration) ---
  const jingliu = charMap.get('Jingliu')!;
  const jlTalent = em.create(Trace, { character: jingliu, type: TraceType.TALENT, description: 'Crescent Transmigration' });
  em.create(Effect, { 
    trace: jlTalent, effectType: EffectType.ACTION_ADVANCE, effectValue: '100.00', triggerCondition: "stacks == 2", durationUnit: DurationUnit.ACTION, maxStacks: 1 
  });

  // --- TOPAZ & NUMBY (Summon) ---
  const topaz = charMap.get('Topaz & Numby')!;
  const numby = em.create(SummonConfig, {
    ownerCharacter: topaz, name: 'Numby', baseSpeed: '80.00', isFixedSpeed: false
  });

  // --- JING YUAN (Summon) ---
  const jy = charMap.get('Jing Yuan')!;
  const lightningLord = em.create(SummonConfig, {
    ownerCharacter: jy, name: 'Lightning Lord', baseSpeed: '60.00', isFixedSpeed: false 
  });

  // --- TINGYUN E1 (Team Speed on Ult) ---
  const tingyun = charMap.get('Tingyun')!;
  const tingyunE1 = em.create(Eidolon, { character: tingyun, rank: 1 });
  em.create(Effect, { 
    eidolon: tingyunE1, effectType: EffectType.SPEED_PERCENT, effectValue: '0.20', triggerCondition: "move_type == 'ult'", durationUnit: DurationUnit.TURN, durationValue: 1, maxStacks: 1 
  });

  // --- YUKONG E1 (Start Speed) ---
  const yukong = charMap.get('Yukong')!;
  const yukongE1 = em.create(Eidolon, { character: yukong, rank: 1 });
  em.create(Effect, { 
    eidolon: yukongE1, effectType: EffectType.SPEED_PERCENT, effectValue: '0.10', triggerCondition: "battle_start", durationUnit: DurationUnit.TURN, durationValue: 2, maxStacks: 1 
  });

  // --- ASTA TALENT (Stacking Speed) ---
  const astaTalent = em.create(Trace, { character: asta, type: TraceType.TALENT, description: 'Astrometry' });
  em.create(Effect, {
    trace: astaTalent, effectType: EffectType.SPEED_FLAT, effectValue: '10.00', maxStacks: 5, triggerCondition: "per_stack", durationUnit: DurationUnit.PERMANENT 
  });

  // --- SUSHANG TALENT (Speed on Break) ---
  const sushangTalent = em.create(Trace, { character: sushang, type: TraceType.TALENT, description: 'Dancing Blade' });
  em.create(Effect, {
    trace: sushangTalent, effectType: EffectType.SPEED_PERCENT, effectValue: '0.20', triggerCondition: "enemy_weakness_break", durationUnit: DurationUnit.TURN, durationValue: 2, maxStacks: 1
  });

  // --- PELA E2 (Speed on Dispel) ---
  const pela = charMap.get('Pela')!;
  const pelaE2 = em.create(Eidolon, { character: pela, rank: 2 });
  em.create(Effect, { 
    eidolon: pelaE2, effectType: EffectType.SPEED_PERCENT, effectValue: '0.10', triggerCondition: "on_dispel", durationUnit: DurationUnit.TURN, durationValue: 2, maxStacks: 1 
  });

  // --- QINGQUE A2 (Speed on Enhanced) ---
  const qq = charMap.get('Qingque')!;
  const qqA2 = em.create(Trace, { character: qq, type: TraceType.A2, description: 'Tile Battle' });
  em.create(Effect, { 
    trace: qqA2, effectType: EffectType.SPEED_PERCENT, effectValue: '0.10', triggerCondition: "move_is_enhanced == true", durationUnit: DurationUnit.TURN, durationValue: 1, maxStacks: 1 
  });

  // --- HERTA (4*) E2 (Speed on Talent) ---
  const herta = charMap.get('Herta')!;
  const hertaE2 = em.create(Eidolon, { character: herta, rank: 2 });
  em.create(Effect, { 
    eidolon: hertaE2, effectType: EffectType.SPEED_PERCENT, effectValue: '0.10', maxStacks: 5, triggerCondition: "talent_triggered", durationUnit: DurationUnit.TURN 
  });

  // --- SILVER WOLF (Talent Slow) ---
  const sw = charMap.get('Silver Wolf')!;
  const swTalent = em.create(Trace, { character: sw, type: TraceType.TALENT, description: 'Awaiting System Response...' });
  em.create(Effect, { 
    trace: swTalent, effectType: EffectType.SPEED_PERCENT, effectValue: '-0.10', triggerCondition: "on_attack_random", durationUnit: DurationUnit.TURN, maxStacks: 1 
  });

  // ==========================================================
  // 6. EXECUTE
  // ==========================================================
  
  await em.persistAndFlush([
    ...pathMap.values(), 
    ...charMap.values(),
    ddd, multiplication, payn, echoes, adversarial,
    hackerspace, eagle, vonwacq,
    numby, lightningLord 
  ]); 

  console.log('✅ 1.X Full Data Seeding (Complete Roster + Logic) Complete!');
  await orm.close(true);
}

bootstrap().catch(err => {
  console.error(err);
  process.exit(1);
});