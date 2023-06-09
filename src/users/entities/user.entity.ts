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

@Schema({ _id: false })
export class Trade extends Document {
  @Prop({
    type: [{ _id: String, active: Boolean }],
  })
  shop: { _id: ObjectId; active?: boolean }[];

  @Prop({
    type: [{ _id: String, active: Boolean }],
  })
  sales: { _id: ObjectId; active?: boolean }[];
}

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

  @Prop({ type: Trade, default: { sales: [], shop: [] } })
  trades: Trade;

  @Prop({ required: true, default: randomUUID() })
  verificationCode?: UUID;

  @Prop({ default: [] })
  tickets?: Ticket[];

  @Prop()
  passwordResetCode?: string | null;

  @Prop({ type: Boolean, default: false })
  verified?: boolean;

  @Prop({ type: Number, default: 0 })
  paidCoins: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
