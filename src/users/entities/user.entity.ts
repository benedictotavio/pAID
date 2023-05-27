import { Logger } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { compare } from 'bcrypt';
import { randomUUID } from 'crypto';
import { Document, HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export const privateFields = [
  'password',
  '__v',
  'verificationCode',
  'passwordResetCode',
  'verified',
];

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User extends Document {
  @Prop({ type: String, required: true })
  firstName?: string;

  @Prop({ type: String, required: true })
  lastName?: string;

  @Prop({ type: String, required: true, unique: true })
  email?: string;

  @Prop({ type: String })
  password?: string;

  @Prop({ required: true, default: randomUUID() })
  verificationCode?: string;

  @Prop()
  passwordResetCode?: string | null;

  @Prop({ default: false })
  verified?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
