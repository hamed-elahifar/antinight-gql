import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { GameStatus } from './enum/game.enums';
import { Document } from 'mongoose';
import { ID, ObjectType } from '@nestjs/graphql';
import { Field } from '@nestjs/graphql';

export type GameDocument = Game & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Game {
  @Field(() => String, { nullable: true })
  _id: number

  @Field(() => String, { nullable: true })
  @Prop({ type: String, default: () => { return (Math.random() + 1).toString(36).substring(6) } })
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

  @Field(() => String, { nullable: true })
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt: Date;
}

export const GameSchema = SchemaFactory.createForClass(Game);
