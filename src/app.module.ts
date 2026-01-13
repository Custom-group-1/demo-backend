import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrmModule } from './modules/orm.module';
import { UserController } from './modules/user/user.controller';
import { UserModule } from './modules/user/user.module';
import { CharacterModule } from './modules/character/character.module';
import { PathModule } from './modules/path/path.module';
import { LightconeModule } from './modules/lightcone/lightcone.module';
import { RelicSetModule } from './modules/relic-set/relic-set.module';
import { MoveModule } from './modules/move/move.module';
import { EffectModule } from './modules/effect/effect.module';
import { TeamPresetModule } from './modules/team-preset/team-preset.module';

@Module({
  imports: [
    OrmModule,
    UserModule,
    CharacterModule,
    PathModule,
    LightconeModule,
    RelicSetModule,
    MoveModule,
    EffectModule,
    TeamPresetModule
  ],
  controllers: [AppController, UserController],
  providers: [AppService, Logger],
})
export class AppModule {}
