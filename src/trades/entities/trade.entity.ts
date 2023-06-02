import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { paymentTicket } from '../dto/create-trade.dto';
import { UUID } from 'crypto';

export type TradeDocument = HydratedDocument<Trade>;

@Schema({
  timestamps: true,
})
export class Trade extends Document {
  @Prop({ type: String })
  ticketId: UUID;
  @Prop({ type: String })
  buyerId: string;
  @Prop({ type: String })
  salerId: string;
  @Prop({ type: Object })
  payment: paymentTicket;
  @Prop({ type: Date })
  timeLimit: Date;
  @Prop({ type: String, default: 'waiting for seller user' })
  status: 'complete' | 'waiting for seller user' | 'canceled';
}

export const TradeSchema = SchemaFactory.createForClass(Trade);
