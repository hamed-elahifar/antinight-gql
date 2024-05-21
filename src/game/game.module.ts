import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameResolver } from './game.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './game.model';
import { PubsubModule } from 'src/pubsub/pubsub.module';

@Module({
  providers: [GameService, GameResolver],
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    PubsubModule,
  ],
  exports: [GameService, GameResolver]
})
export class GameModule {}
