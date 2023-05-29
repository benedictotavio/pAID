import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, ObjectId } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

export type AuthDocument = HydratedDocument<Auth>;

@Schema({
  timestamps: true,
  collection: 'auth_sessions',
})
export class Auth extends Document {
  @Prop({ type: String })
  user?: string;

  @Prop({ default: true })
  valid?: boolean;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
