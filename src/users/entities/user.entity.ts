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

  @Prop({ type: Array<ObjectId>, default: { shop: [], sales: [] } })
  trades?: {
    shop: string[];
    sales: string[];
  };

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
}

export const UserSchema = SchemaFactory.createForClass(User);
