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
  @Prop({ type: String, default: () => { return makeid(6) }, unique: true, index: true })
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

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
