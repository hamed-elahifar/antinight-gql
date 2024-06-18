import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameResolver } from './game.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './game.model';
import { PubsubModule } from 'src/pubsub/pubsub.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/strategies';
import jwtConfig from 'src/auth/config/jwt.config';
import { SmsModule } from 'src/sms/sms.module';

@Module({
  providers: [GameService, GameResolver],
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    PubsubModule,
    SmsModule,
  ],
  exports: [GameService, GameResolver]
})
export class GameModule { }
