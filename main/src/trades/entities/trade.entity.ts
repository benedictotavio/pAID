import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { UUID } from 'crypto';

export type TradeDocument = HydratedDocument<Trade>;
export enum StatusTrade{
  COMPLETE,
  WAITING,
  CANCELED
}

@Schema({
  timestamps: true,
})
export class Trade extends Document {
  @Prop({ type: String })
  ticketId: UUID;
  @Prop({ type: String })
  buyer: string;
  @Prop({ type: String })
  saler: string;
  @Prop({ type: Date })
  timeLimit: Date;
  @Prop({ type: String, default: StatusTrade.WAITING})
  status: StatusTrade;
}

export const TradeSchema = SchemaFactory.createForClass(Trade);
