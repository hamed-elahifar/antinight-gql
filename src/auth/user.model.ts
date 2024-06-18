import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { Document } from 'mongoose';
import { UserRoleEnum } from 'src/common/enums/user-role.enum';
import { randomInt } from 'src/common/helpers/random-number-generator';

export type UserType = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop({ default: () => { randomInt(10000, 99999) } })
  twoFA: string;

  @Prop({ unique: true })
  phone: string;

  @Prop()
  email: string;

  @Prop({ type: [String, [String]], enum: Object.values(UserRoleEnum) })
  roles: string | string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ phone: 1 });
