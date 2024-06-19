import { Resolver, Mutation, Args, Subscription, Query, } from '@nestjs/graphql';
import { GameService } from './game.service';
import { Game } from './game.model';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { Inject, UseGuards } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { AccessTokenGuard } from 'src/common/guards';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';

@UseGuards(AccessTokenGuard)
@Resolver()
export class GameResolver {
  constructor(
    private readonly gameService: GameService,
    @Inject(PUB_SUB) private readonly pubsub: RedisPubSub,
  ) {}

  @Query(() => String)
  async findAll(/*@Args('id', { type: () => ID }, ParseIntPipe) id: number*/) {
    return "OK" //this.gameService.findOne(id)
  }

  @Mutation(() => Game, { description: 'create a new game' })
  async createGame(@GetCurrentUser() jwt: any) {
    const newGame = await this.gameService.create(jwt);
    this.pubsub.publish(newGame.id, { game: newGame });
    return newGame;
  }

  @Mutation(() => Game, { description: 'create a new game' })
  async update(@Args('id') id: string) {
    const gameData = await this.gameService.update(id);
    this.pubsub.publish(gameData.id, gameData);
    return gameData;
  }

  @Mutation(() => String,)
  async unsubscribe(@Args('id') id: string) {
    // @ts-ignore
    this.pubsub.unsubscribe(1);
    return "ok";
  }

  @Subscription(() => Game, {
    resolve(this: GameResolver, value) {
      return value;
    },
  })
  async newGameEvent(@Args('id') id: string) {
    return this.pubsub.asyncIterator(id);
  }
}
