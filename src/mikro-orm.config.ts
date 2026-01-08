import { Logger } from '@nestjs/common';
import { defineConfig } from '@mikro-orm/postgresql';
import { 
  User,
  Path, Character, Eidolon, Trace, SummonConfig,
  RelicSet, Lightcone,
  Move, RelicMove, LightconeMove, Effect,
  Session, SessionEntity, SessionResource, SessionActiveEffect
} from './entities/User'; // Ensure this path points to your User.ts file

const logger = new Logger('MikroORM');

export default defineConfig({
  entities: [
    User,
    Path, Character, Eidolon, Trace, SummonConfig,
    RelicSet, Lightcone, 
    Move, RelicMove, LightconeMove, Effect,
    Session, SessionEntity, SessionResource, SessionActiveEffect
  ],
  
  dbName: 'mobile-demo',
  port: 5432,
  debug: true,
  logger: logger.log.bind(logger),

  user: process.env.POSTGRES_USERNAME ?? 'postgres',
  password: process.env.POSTGRES_PASSWORD ?? 'admin',
  
  // Allow schema generator to create tables cleanly
  schemaGenerator: {
    disableForeignKeys: false, // strictly enforce relationships
  },
});