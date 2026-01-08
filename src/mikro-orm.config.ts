import { Logger } from '@nestjs/common';
import { defineConfig } from '@mikro-orm/postgresql';
import { 
  User,
  Path, Character, Eidolon, Trace, SummonConfig,
  RelicSet, Lightcone,
  Move, RelicMove, LightconeMove, Effect,
  Session, SessionEntity, SessionResource, SessionActiveEffect
} from './entities/User'; 

const logger = new Logger('MikroORM');

const isSsl = process.env.DB_SSL === 'true';

export default defineConfig({
  entities: [
    User,
    Path, Character, Eidolon, Trace, SummonConfig,
    RelicSet, Lightcone, 
    Move, RelicMove, LightconeMove, Effect,
    Session, SessionEntity, SessionResource, SessionActiveEffect
  ],
  
  host: process.env.DB_HOST ?? '127.0.0.1',

  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  dbName: process.env.DB_NAME ?? 'mobile-demo',
  
  user: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'admin',

  debug: true,
  logger: logger.log.bind(logger),

  driverOptions: isSsl ? {
    connection: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  } : undefined,

  schemaGenerator: {
    disableForeignKeys: false,
  },
});