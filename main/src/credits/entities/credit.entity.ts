import { Prop } from '@nestjs/mongoose';

export type paymentTicket = {
  method: string;
  installment: number;
};

export class Credit {
  @Prop({ type: Number, required: true })
  credits: number;
  @Prop({ type: Object, required: true })
  payment: paymentTicket;
}
