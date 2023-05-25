import { Logger } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, ObtainDocumentType } from 'mongoose';

import { v5 as uiid5 } from 'uuid';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  writeConcern: {
    w: 400,
  },
  collection: 'user',
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

  @Prop({ required: true, default: () => uiid5 })
  public verificationCode?: string;

  @Prop()
  public passwordResetCode?: string | null;

  @Prop({ default: false })
  public verified?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
