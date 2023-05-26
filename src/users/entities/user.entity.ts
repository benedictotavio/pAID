import { Logger } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Document, HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User extends Document {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: String })
  passwordConfirmation: string;

  @Prop({ required: true, default: randomUUID() })
  public verificationCode?: string;

  @Prop()
  public passwordResetCode?: string | null;

  @Prop({ default: false })
  public verified?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
