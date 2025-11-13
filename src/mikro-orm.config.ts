import { Logger } from '@nestjs/common';
import { defineConfig } from '@mikro-orm/postgresql';

const logger = new Logger('MikroORM');

export default defineConfig({
  // Add all new entities to this array alongside User
  entities: [
    User,
    Path, Character, RelicSet, Lightcone, 
    Move, RelicMove, LightconeMove, Effect, LightconeImposition,
    AllowedRelic, Equip, 
    CharacterAction, Session, SessionEntity, SessionTimeline
  ],
  
  dbName: 'mobile-demo',
  port: 5432,
  debug: true,
  logger: logger.log.bind(logger),

  user: process.env.POSTGRES_USERNAME ?? 'postgres',
  password: process.env.POSTGRES_PASSWORD ?? 'postgres',

});
