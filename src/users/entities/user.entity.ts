import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID, randomUUID } from 'crypto';
import { Document, HydratedDocument, ObjectId } from 'mongoose';
import { Ticket } from '../../tickets/entities/ticket.entity';

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
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: String, required: true, default: randomUUID() })
  verificationCode?: string;

  @Prop({ type: Array, default: [] })
  tickets?: Array<Ticket>;

  @Prop({ type: String })
  passwordResetCode?: string | null;

  @Prop({ type: Boolean, default: false })
  verified?: boolean;

  @Prop({ type: Object, default: { sales: [], shop: [] } })
  trades?: {
    sales: ObjectId[];
    shop: ObjectId[];
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
