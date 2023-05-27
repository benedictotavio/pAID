import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

export type AuthDocument = HydratedDocument<Auth>;

@Schema({
  timestamps: true,
  collection: 'sessions',
})
export class Auth extends Document {
  @Prop({ ref: () => User })
  user?: User;

  @Prop({ default: true })
  valid?: boolean;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
