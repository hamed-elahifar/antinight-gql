import { Resolver, Mutation, Args, Subscription, Query, ID } from '@nestjs/graphql';
import { GameService } from './game.service';
import { CreateGameInput } from './input/create-game.input';

import { Game } from './game.model';

import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { Inject, ParseIntPipe } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Resolver()
export class GameResolver {
  constructor(
    private readonly gameService: GameService,
    @Inject(PUB_SUB) private readonly pubsub: RedisPubSub,
  ) { }


  @Query(() => String)
  async findAll(/*@Args('id', { type: () => ID }, ParseIntPipe) id: number*/) {
    return "test" //this.gameService.findOne(id)
  }

  @Mutation(() => Game, { description: 'create a new game' })
  async newGame(/*@Args('game') game: CreateGameInput*/) {
    const newGame = await this.gameService.create();
    this.pubsub.publish(newGame.id, { game: newGame });
    return newGame;
  }

  @Mutation(() => Game, { description: 'create a new game' })
  async update(@Args('id') id: string) {
    const result = await this.gameService.update(id);
    this.pubsub.publish(result.id, { game: result });
    return result;
  }

  @Subscription(() => Game, {
    resolve(this: GameResolver, value) {
      return value;
    },
  })
  async newGameEvent(@Args('id') id: string) {
    return await this.pubsub.asyncIterator(id);
    // console.log(subResult)
    // return subResult
  }
}
