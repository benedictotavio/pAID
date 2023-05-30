import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Document, HydratedDocument } from 'mongoose';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { Trade } from 'src/trades/entities/trade.entity';

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

  @Prop({ required: true, default: randomUUID() })
  verificationCode?: string;

  @Prop({ default: [] })
  tickets?: Array<Ticket>;

  @Prop()
  passwordResetCode?: string | null;

  @Prop({ default: false })
  verified?: boolean;

  @Prop({ default: [] })
  trades: Trade[];
}

export const UserSchema = SchemaFactory.createForClass(User);
