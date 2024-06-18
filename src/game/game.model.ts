import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { GameStatus } from './enum/game.enums';
import { Document } from 'mongoose';
import { ID, ObjectType } from '@nestjs/graphql';
import { Field } from '@nestjs/graphql';
import { randomGameID } from 'src/common/helpers/random-number-generator';

export type GameDocument = Game & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Game {
  @Field(() => String, { nullable: true })
  _id: number

  @Field(() => String, { nullable: true })
  @Prop({ type: String, default: () => { return randomGameID(6) }, unique: true, index: true })
  id: string;

  @Field(() => [String], { nullable: true })
  @Prop({ type: [String] })
  players: string[];

  @Field(() => String, { nullable: true })
  @Prop()
  owner: string;

  @Field(() => String, { nullable: true })
  @Prop({ enum: GameStatus, default: GameStatus.LOBBY })
  status: string;

  @Field(() => Date, { nullable: true })
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt: Date;
}

export const GameSchema = SchemaFactory.createForClass(Game);


