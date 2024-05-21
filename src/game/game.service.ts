import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGameInput } from './input/create-game.input';
import { UpdateGameInput } from './input/update-game.input';
import { Game, GameDocument } from './game.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class GameService {
  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>) { }

  async create() {
    const game = new this.gameModel;
    await game.save()
    return game
  }

  async update(id: string): Promise<Game> {
    const game = await this.gameModel.findOne({ id })

    if (!game) {
      throw new NotFoundException('Game NOT Found')
    }

    game.players.push(this.getRandomInt() + "A")
    await game.save()

    return game
  }

  async findAll() {
    return []
  }

  private getRandomInt(min = 1, max = 99) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
