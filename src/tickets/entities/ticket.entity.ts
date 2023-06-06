import { Prop } from '@nestjs/mongoose';
import { UUID, randomUUID } from 'crypto';

export class Ticket {
  @Prop({ type: String, required: true })
  title: string;
  @Prop({ type: String, required: true })
  category: string;
  @Prop({ type: Number, required: true })
  price: number;
  @Prop({ type: String })
  description: string;
  @Prop({ default: randomUUID(), unique: true })
  _id: UUID;
  @Prop({ default: new Date(Date.now()) })
  dateBuy: Date;
  @Prop({ type: Date, required: true })
  dateEvent: Date;
  @Prop({ type: String, required: true })
  plataform: string;
}
