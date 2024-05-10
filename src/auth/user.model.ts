import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { Document } from 'mongoose';
import { UserRoleEnum } from 'src/common/enums/user-role.enum';

export type UserType = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true })
  username: string;

  @Prop({ select: false })
  password: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop({ type: [String, [String]], enum: Object.values(UserRoleEnum) })
  roles: string | string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ phone: 1 });

UserSchema.pre('save', async function (next: any) {
  if (!this.isModified('password')) return next();
  this.password = await hash(this.password, 10);
  next();
});
